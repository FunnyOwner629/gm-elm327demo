import { VehicleData } from '../types/elm327';
import { Gauge } from './Gauge';

interface DashboardProps {
  data: VehicleData;
}

export function Dashboard({ data }: DashboardProps) {
  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Live Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Gauge
          label="Engine RPM"
          value={data.rpm || 0}
          unit="RPM"
          min={0}
          max={8000}
          warningThreshold={6000}
          dangerThreshold={7000}
        />

        <Gauge
          label="Vehicle Speed"
          value={data.speed || 0}
          unit="km/h"
          min={0}
          max={200}
        />

        <Gauge
          label="Coolant Temp"
          value={data.coolantTemp || 0}
          unit="°C"
          min={0}
          max={120}
          warningThreshold={95}
          dangerThreshold={105}
        />

        <Gauge
          label="Intake Temp"
          value={data.intakeTemp || 0}
          unit="°C"
          min={-20}
          max={100}
          warningThreshold={70}
          dangerThreshold={85}
        />

        <Gauge
          label="MAF Rate"
          value={data.maf || 0}
          unit="g/s"
          min={0}
          max={200}
        />

        <Gauge
          label="Throttle"
          value={data.throttle || 0}
          unit="%"
          min={0}
          max={100}
        />
      </div>
    </div>
  );
}
