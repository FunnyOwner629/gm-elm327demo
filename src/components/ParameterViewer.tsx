import { useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { gmParameters, gmCategories } from '../data/gmParameters';
import { GMParameter } from '../types/elm327';

interface ParameterViewerProps {
  onReadParameter: (param: GMParameter) => void;
}

export function ParameterViewer({ onReadParameter }: ParameterViewerProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [paramValues, setParamValues] = useState<Record<string, number>>({});

  const filteredParams = gmParameters.filter(param => {
    const matchesCategory = selectedCategory === 'All' || param.category === selectedCategory;
    const matchesSearch = param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         param.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleReadParameter = async (param: GMParameter) => {
    onReadParameter(param);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">GM Parameters</h2>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search parameters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {gmCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Parameter</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Range</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredParams.map(param => (
              <tr key={param.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{param.name}</span>
                    {param.writable && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" title="Writable parameter" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{param.description}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {param.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{param.unit}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {param.min !== undefined && param.max !== undefined
                    ? `${param.min} - ${param.max}`
                    : '-'}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleReadParameter(param)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-all"
                  >
                    Read
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredParams.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No parameters found matching your criteria
        </div>
      )}
    </div>
  );
}
