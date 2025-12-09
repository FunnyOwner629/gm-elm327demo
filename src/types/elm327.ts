export interface ELM327Connection {
  port: SerialPort | null;
  reader: ReadableStreamDefaultReader<Uint8Array> | null;
  writer: WritableStreamDefaultWriter<Uint8Array> | null;
  connected: boolean;
}

export interface OBDCommand {
  name: string;
  command: string;
  bytes: number;
  description: string;
  unit?: string;
  min?: number;
  max?: number;
}

export interface GMParameter {
  id: string;
  name: string;
  command: string;
  description: string;
  unit: string;
  category: string;
  writable: boolean;
  min?: number;
  max?: number;
  formula?: (value: number) => number;
}

export interface DataLog {
  timestamp: number;
  parameters: Record<string, number>;
}

export interface VehicleData {
  rpm?: number;
  speed?: number;
  coolantTemp?: number;
  intakeTemp?: number;
  maf?: number;
  throttle?: number;
  fuelPressure?: number;
  sparkAdvance?: number;
  o2Voltage?: number;
  fuelTrim?: number;
}
