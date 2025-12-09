import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionPanelProps {
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  vehicleInfo?: string;
}

export function ConnectionPanel({ connected, onConnect, onDisconnect, vehicleInfo }: ConnectionPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ELM327 Connection</h2>
          <p className="text-gray-600">
            {connected ? 'Connected to vehicle' : 'Not connected'}
          </p>
          {vehicleInfo && (
            <p className="text-sm text-gray-500 mt-1">VIN: {vehicleInfo}</p>
          )}
        </div>

        <button
          onClick={connected ? onDisconnect : onConnect}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            connected
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {connected ? (
            <>
              <WifiOff className="w-5 h-5" />
              Disconnect
            </>
          ) : (
            <>
              <Wifi className="w-5 h-5" />
              Connect
            </>
          )}
        </button>
      </div>

      {!connected && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Connection Instructions:</h3>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
            <li>Connect your ELM327 device via USB</li>
            <li>Click the Connect button above</li>
            <li>Select your ELM327 device from the browser dialog</li>
            <li>Wait for initialization (this may take a few seconds)</li>
          </ol>
          <p className="mt-2 text-xs text-blue-700">
            Note: This application requires a browser with Web Serial API support (Chrome, Edge, Opera)
          </p>
        </div>
      )}
    </div>
  );
}
