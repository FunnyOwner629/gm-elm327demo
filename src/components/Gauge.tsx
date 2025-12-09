interface GaugeProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  warningThreshold?: number;
  dangerThreshold?: number;
}

export function Gauge({ label, value, unit, min, max, warningThreshold, dangerThreshold }: GaugeProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  let color = 'bg-green-500';
  if (dangerThreshold && value >= dangerThreshold) {
    color = 'bg-red-500';
  } else if (warningThreshold && value >= warningThreshold) {
    color = 'bg-yellow-500';
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{label}</h3>

      <div className="relative h-32 flex items-center justify-center mb-4">
        <svg className="w-full h-full" viewBox="0 0 200 120">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
            className={color.replace('bg-', 'text-')}
          />
          <text
            x="100"
            y="85"
            textAnchor="middle"
            className="text-3xl font-bold fill-gray-800"
          >
            {value.toFixed(0)}
          </text>
          <text
            x="100"
            y="105"
            textAnchor="middle"
            className="text-sm fill-gray-600"
          >
            {unit}
          </text>
        </svg>
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
