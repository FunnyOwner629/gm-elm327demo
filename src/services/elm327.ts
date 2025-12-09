import { ELM327Connection } from '../types/elm327';

export class ELM327Service {
  private connection: ELM327Connection = {
    port: null,
    reader: null,
    writer: null,
    connected: false,
  };

  private textDecoder = new TextDecoder();
  private textEncoder = new TextEncoder();

  async connect(): Promise<boolean> {
    try {
      if (!('serial' in navigator)) {
        throw new Error('Web Serial API not supported in this browser');
      }

      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 38400 });

      this.connection.port = port;
      this.connection.reader = port.readable.getReader();
      this.connection.writer = port.writable.getWriter();
      this.connection.connected = true;

      await this.initialize();
      return true;
    } catch (error) {
      console.error('Connection error:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.connection.reader) {
        await this.connection.reader.cancel();
        this.connection.reader.releaseLock();
      }
      if (this.connection.writer) {
        await this.connection.writer.close();
        this.connection.writer.releaseLock();
      }
      if (this.connection.port) {
        await this.connection.port.close();
      }
      this.connection.connected = false;
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }

  private async initialize(): Promise<void> {
    await this.sendCommand('ATZ');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.sendCommand('ATE0');
    await this.sendCommand('ATL0');
    await this.sendCommand('ATS0');
    await this.sendCommand('ATH0');
    await this.sendCommand('ATSP0');
  }

  async sendCommand(command: string): Promise<string> {
    if (!this.connection.writer || !this.connection.reader) {
      throw new Error('Not connected to ELM327');
    }

    const data = this.textEncoder.encode(command + '\r');
    await this.connection.writer.write(data);

    let response = '';
    let attempts = 0;
    const maxAttempts = 50;

    while (attempts < maxAttempts) {
      const { value, done } = await this.connection.reader.read();
      if (done) break;

      const chunk = this.textDecoder.decode(value);
      response += chunk;

      if (response.includes('>')) {
        break;
      }
      attempts++;
    }

    return response.replace(/\r/g, '').replace(/>/g, '').trim();
  }

  async readPID(mode: string, pid: string): Promise<string> {
    const command = `${mode}${pid}`;
    const response = await this.sendCommand(command);
    return this.parseResponse(response);
  }

  private parseResponse(response: string): string {
    const lines = response.split('\n').filter(line => line.trim());
    const dataLine = lines.find(line => /^[0-9A-F\s]+$/.test(line));
    return dataLine?.replace(/\s/g, '') || '';
  }

  async getVIN(): Promise<string> {
    try {
      const response = await this.sendCommand('0902');
      return this.parseVIN(response);
    } catch (error) {
      console.error('Error reading VIN:', error);
      return 'Unknown';
    }
  }

  private parseVIN(response: string): string {
    const hex = response.replace(/\s/g, '').replace(/49020[0-9]/g, '');
    let vin = '';
    for (let i = 0; i < hex.length; i += 2) {
      const byte = parseInt(hex.substr(i, 2), 16);
      if (byte >= 32 && byte <= 126) {
        vin += String.fromCharCode(byte);
      }
    }
    return vin.trim() || 'Unknown';
  }

  isConnected(): boolean {
    return this.connection.connected;
  }

  async getRPM(): Promise<number> {
    const response = await this.readPID('01', '0C');
    if (response.length >= 8) {
      const a = parseInt(response.substr(4, 2), 16);
      const b = parseInt(response.substr(6, 2), 16);
      return (a * 256 + b) / 4;
    }
    return 0;
  }

  async getSpeed(): Promise<number> {
    const response = await this.readPID('01', '0D');
    if (response.length >= 6) {
      return parseInt(response.substr(4, 2), 16);
    }
    return 0;
  }

  async getCoolantTemp(): Promise<number> {
    const response = await this.readPID('01', '05');
    if (response.length >= 6) {
      return parseInt(response.substr(4, 2), 16) - 40;
    }
    return 0;
  }

  async getIntakeTemp(): Promise<number> {
    const response = await this.readPID('01', '0F');
    if (response.length >= 6) {
      return parseInt(response.substr(4, 2), 16) - 40;
    }
    return 0;
  }

  async getMAF(): Promise<number> {
    const response = await this.readPID('01', '10');
    if (response.length >= 8) {
      const a = parseInt(response.substr(4, 2), 16);
      const b = parseInt(response.substr(6, 2), 16);
      return (a * 256 + b) / 100;
    }
    return 0;
  }

  async getThrottlePosition(): Promise<number> {
    const response = await this.readPID('01', '11');
    if (response.length >= 6) {
      return (parseInt(response.substr(4, 2), 16) * 100) / 255;
    }
    return 0;
  }
}
