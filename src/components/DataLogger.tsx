import { useState, useEffect } from 'react';
import { Download, Play, Square } from 'lucide-react';
import { DataLog } from '../types/elm327';

interface DataLoggerProps {
  onToggleLogging: (enabled: boolean) => void;
  isLogging: boolean;
  logs: DataLog[];
}

export function DataLogger({ onToggleLogging, isLogging, logs }: DataLoggerProps) {
  const [selectedParams, setSelectedParams] = useState<string[]>(['rpm', 'speed', 'coolant_temp']);

  const handleExport = () => {
    if (logs.length === 0) return;

    const headers = ['Timestamp', ...selectedParams];
    const rows = logs.map(log => [
      new Date(log.timestamp).toISOString(),
      ...selectedParams.map(param => log.parameters[param] || 0)
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gm-tuning-log-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Data Logger</h2>

        <div className="flex gap-3">
          <button
            onClick={() => onToggleLogging(!isLogging)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              isLogging
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isLogging ? (
              <>
                <Square className="w-4 h-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start
              </>
            )}
          </button>

          <button
            onClick={handleExport}
            disabled={logs.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Logging Status</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isLogging ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium">
                {isLogging ? 'Recording...' : 'Stopped'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {logs.length} data points recorded
            </p>
          </div>
        </div>

        {logs.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Recent Data</h3>
            <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {logs.slice(-10).reverse().map((log, index) => (
                  <div key={index} className="text-xs font-mono bg-white p-2 rounded border border-gray-200">
                    <span className="text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    {' - '}
                    <span className="text-gray-800">
                      {Object.entries(log.parameters).map(([key, value]) =>
                        `${key}: ${typeof value === 'number' ? value.toFixed(2) : value}`
                      ).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
