import React, { useState, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { Location } from '../types/weather';
import { searchLocations } from '../services/weatherService';

interface SearchModalProps {
  onClose: () => void;
  onLocationSelect: (location: Location) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose, onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const locations = await searchLocations(searchQuery);
      setResults(locations);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSearch(value);
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Search Location</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-100" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-900" />
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search for a city..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-64 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mx-auto"></div>
            </div>
          )}

          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="p-4 text-center text-gray-500">
              No locations found for "{query}"
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="divide-y divide-gray-200">
              {results.map((location, index) => (
                <button
                  key={index}
                  onClick={() => onLocationSelect(location)}
                  className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">{location.name}</div>
                    <div className="text-sm text-gray-500">
                      {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {query.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              Start typing to search for locations
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;