import { useState, useEffect, useRef } from 'react';
import { Car, Activity } from 'lucide-react';
import { ELM327Service } from './services/elm327';
import { ConnectionPanel } from './components/ConnectionPanel';
import { Dashboard } from './components/Dashboard';
import { DataLogger } from './components/DataLogger';
import { ParameterViewer } from './components/ParameterViewer';
import { VehicleData, DataLog, GMParameter } from './types/elm327';

function App() {
  const [connected, setConnected] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<string>('');
  const [vehicleData, setVehicleData] = useState<VehicleData>({});
  const [isLogging, setIsLogging] = useState(false);
  const [logs, setLogs] = useState<DataLog[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'parameters' | 'logger'>('dashboard');

  const elm327Ref = useRef<ELM327Service | null>(null);
  const pollingIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    elm327Ref.current = new ELM327Service();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (elm327Ref.current?.isConnected()) {
        elm327Ref.current.disconnect();
      }
    };
  }, []);

  const handleConnect = async () => {
    if (!elm327Ref.current) return;

    try {
      const success = await elm327Ref.current.connect();
      if (success) {
        setConnected(true);
        const vin = await elm327Ref.current.getVIN();
        setVehicleInfo(vin);
        startPolling();
      } else {
        alert('Failed to connect to ELM327 device');
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Error connecting to ELM327 device. Make sure it is properly connected.');
    }
  };

  const handleDisconnect = async () => {
    if (!elm327Ref.current) return;

    stopPolling();
    await elm327Ref.current.disconnect();
    setConnected(false);
    setVehicleInfo('');
    setVehicleData({});
  };

  const startPolling = () => {
    if (pollingIntervalRef.current) return;

    pollingIntervalRef.current = window.setInterval(async () => {
      if (!elm327Ref.current) return;

      try {
        const [rpm, speed, coolantTemp, intakeTemp, maf, throttle] = await Promise.all([
          elm327Ref.current.getRPM(),
          elm327Ref.current.getSpeed(),
          elm327Ref.current.getCoolantTemp(),
          elm327Ref.current.getIntakeTemp(),
          elm327Ref.current.getMAF(),
          elm327Ref.current.getThrottlePosition(),
        ]);

        const newData: VehicleData = {
          rpm,
          speed,
          coolantTemp,
          intakeTemp,
          maf,
          throttle,
        };

        setVehicleData(newData);

        if (isLogging) {
          setLogs(prev => [
            ...prev,
            {
              timestamp: Date.now(),
              parameters: {
                rpm,
                speed,
                coolant_temp: coolantTemp,
                intake_temp: intakeTemp,
                maf,
                throttle,
              },
            },
          ]);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 1000);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const handleToggleLogging = (enabled: boolean) => {
    setIsLogging(enabled);
    if (!enabled) {
      setLogs([]);
    }
  };

  const handleReadParameter = async (param: GMParameter) => {
    if (!elm327Ref.current || !connected) {
      alert('Please connect to the ELM327 device first');
      return;
    }

    try {
      const response = await elm327Ref.current.readPID(
        param.command.substring(0, 2),
        param.command.substring(2)
      );
      alert(`${param.name}: ${response || 'No data'}`);
    } catch (error) {
      console.error('Error reading parameter:', error);
      alert('Error reading parameter');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Car className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GM ELM327 Tuning Program</h1>
              <p className="text-sm text-gray-600">Professional OBD-II Diagnostics & Tuning</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <ConnectionPanel
            connected={connected}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            vehicleInfo={vehicleInfo}
          />

          {connected && (
            <>
              <div className="bg-white rounded-lg shadow-md p-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === 'dashboard'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Activity className="w-5 h-5" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('parameters')}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === 'parameters'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Parameters
                  </button>
                  <button
                    onClick={() => setActiveTab('logger')}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === 'logger'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Data Logger
                  </button>
                </div>
              </div>

              {activeTab === 'dashboard' && <Dashboard data={vehicleData} />}
              {activeTab === 'parameters' && <ParameterViewer onReadParameter={handleReadParameter} />}
              {activeTab === 'logger' && (
                <DataLogger
                  onToggleLogging={handleToggleLogging}
                  isLogging={isLogging}
                  logs={logs}
                />
              )}
            </>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Based on open source GM tuning projects. For educational and diagnostic purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
