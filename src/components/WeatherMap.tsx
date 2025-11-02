import React from 'react';
import { Map, Satellite, Layers } from 'lucide-react';
import { Location } from '../types/weather';

interface WeatherMapProps {
  location: Location | null;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ location }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Weather Map</h3>
        <div className="flex space-x-2">
          <button className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors">
            <Map className="h-4 w-4" />
          </button>
          <button className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors">
            <Satellite className="h-4 w-4" />
          </button>
          <button className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors">
            <Layers className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="bg-white/10 rounded-xl h-64 flex items-center justify-center">
        <div className="text-center">
          <Map className="h-16 w-16 mx-auto mb-4 text-white/60" />
          <p className="text-white/80">Interactive weather map</p>
          <p className="text-sm text-white/60 mt-2">
            {location ? `Centered on ${location.name}` : 'Loading location...'}
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <span>Precipitation</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span>Temperature</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span>Wind</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;