# GM ELM327 Tuning Program

A professional web-based OBD-II diagnostic and tuning application for GM vehicles using ELM327 interfaces.

## Features

- **Real-time Vehicle Monitoring**: Live dashboard with gauges for key engine parameters
- **GM-Specific Parameters**: Comprehensive list of GM vehicle parameters and PIDs
- **Data Logging**: Record and export vehicle data in CSV format for analysis
- **ELM327 Integration**: Direct communication with ELM327 devices via Web Serial API
- **Parameter Reading**: Read individual ECU parameters on demand
- **Professional UI**: Clean, modern interface with organized tabs and controls

## Supported Parameters

The application monitors and displays:
- Engine RPM
- Vehicle Speed
- Coolant Temperature
- Intake Air Temperature
- Mass Air Flow (MAF)
- Throttle Position
- Fuel Pressure
- Timing Advance
- O2 Sensor Voltage
- Fuel Trim (Short & Long Term)
- Intake Manifold Pressure
- Fuel Level
- Engine Load
- Fuel Consumption Rate

## Requirements

### Hardware
- ELM327 OBD-II interface (USB recommended)
- GM vehicle with OBD-II port (1996 or newer)

### Software
- Modern web browser with Web Serial API support:
  - Google Chrome 89+
  - Microsoft Edge 89+
  - Opera 76+
  - **Note**: Firefox and Safari do not currently support Web Serial API

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
*5. run ( npm audit fix --force ) for no funding.

## Usage

### Connecting to Your Vehicle

1. Connect your ELM327 device to your vehicle's OBD-II port
2. Connect the ELM327 device to your computer via USB
3. Open the application in a supported web browser
4. Click the "Connect" button
5. Select your ELM327 device from the browser's device picker
6. Wait for initialization (usually 2-5 seconds)

### Using the Dashboard

Once connected, the Dashboard tab displays real-time gauges for:
- Engine performance metrics
- Temperature readings
- Fuel system parameters

Gauges automatically update every second with live data from your vehicle.

### Reading Parameters

1. Switch to the "Parameters" tab
2. Browse the complete list of available GM parameters
3. Filter by category (Engine, Fuel, Ignition, Vehicle)
4. Search for specific parameters
5. Click "Read" to retrieve the current value

### Data Logging

1. Switch to the "Data Logger" tab
2. Click "Start" to begin recording data
3. Drive or test your vehicle
4. Click "Stop" when finished
5. Click "Export CSV" to download your data for analysis

The CSV file includes timestamps and all monitored parameters, perfect for importing into Excel or analysis tools.

## Technical Details

### Architecture

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Communication**: Web Serial API
- **Protocol**: ELM327 AT commands + OBD-II Mode 01 PIDs

### Project Structure

```
src/
├── components/         # React components
│   ├── ConnectionPanel.tsx
│   ├── Dashboard.tsx
│   ├── DataLogger.tsx
│   ├── Gauge.tsx
│   └── ParameterViewer.tsx
├── services/          # Business logic
│   └── elm327.ts      # ELM327 communication service
├── data/              # Data definitions
│   └── gmParameters.ts # GM-specific PID definitions
├── types/             # TypeScript types
│   └── elm327.ts
└── App.tsx            # Main application
```

### Based on Open Source Projects

This application is inspired by and based on research from:
- [opensourcetuning/GM](https://github.com/opensourcetuning/GM) - Open Source GM Tuning Project
- PcmHacks community at pcmhacking.net
- ELM327 protocol documentation and community projects

## Safety & Legal Notice

**IMPORTANT**: This application is for educational and diagnostic purposes only.

- Always follow local laws and regulations
- Never modify vehicle parameters while driving
- Improper ECU modifications can damage your vehicle
- Use at your own risk
- The authors are not responsible for any damage to your vehicle

## Browser Compatibility

| Browser | Version | Supported |
|---------|---------|-----------|
| Chrome  | 89+     | ✓ Yes     |
| Edge    | 89+     | ✓ Yes     |
| Opera   | 76+     | ✓ Yes     |
| Firefox | Any     | ✗ No      |
| Safari  | Any     | ✗ No      |

## Troubleshooting

### "Web Serial API not supported"
- Ensure you're using a supported browser (Chrome, Edge, or Opera)
- Update your browser to the latest version

### Connection fails
- Check that your ELM327 device is properly connected
- Verify the device is recognized by your operating system
- Try unplugging and reconnecting the device
- Some cheap ELM327 clones may not work properly - genuine devices are recommended

### No data displayed
- Ensure your vehicle's engine is running
- Check that the ELM327 device is properly connected to the OBD-II port
- Try reconnecting the device
- Verify your vehicle supports the requested PIDs (some parameters may not be available on all vehicles)

## License

GPL-3.0 - Following the license of the open source GM tuning projects this is based on.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## Resources

- [ELM327 Documentation](https://www.elmelectronics.com/wp-content/uploads/2016/07/ELM327DS.pdf)
- [OBD-II PIDs Reference](https://en.wikipedia.org/wiki/OBD-II_PIDs)
- [PCM Hacking Forums](https://pcmhacking.net/)
- [Web Serial API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API)
