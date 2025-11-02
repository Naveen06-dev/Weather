import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sun,
  CloudRain,
  Cloud,
  CloudSnow
} from 'lucide-react';
import { WeatherData } from '../types/weather';
import { convertTemperature, getWeatherIcon } from '../utils/weatherUtils';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit }) => {
  const { current, location } = data;
  const temp = convertTemperature(current.temperature, unit);
  const feelsLike = convertTemperature(current.feelsLike, unit);

  const WeatherIcon = getWeatherIcon(current.icon);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Weather Info */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{location.name}</h2>
            <p className="text-white/80">{location.region}, {location.country}</p>
            <p className="text-sm text-white/60">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <WeatherIcon className="h-16 w-16" />
              <div>
                <div className="text-5xl font-light">{Math.round(temp)}°</div>
                <div className="text-lg text-white/80 capitalize">{current.description}</div>
              </div>
            </div>
          </div>

          <div className="text-white/80">
            Feels like {Math.round(feelsLike)}°{unit === 'celsius' ? 'C' : 'F'}
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Droplets className="h-5 w-5 text-blue-300" />
              <span className="text-sm text-white/80">Humidity</span>
            </div>
            <div className="text-2xl font-semibold">{current.humidity}%</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wind className="h-5 w-5 text-green-300" />
              <span className="text-sm text-white/80">Wind Speed</span>
            </div>
            <div className="text-2xl font-semibold">{current.windSpeed} km/h</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Gauge className="h-5 w-5 text-purple-300" />
              <span className="text-sm text-white/80">Pressure</span>
            </div>
            <div className="text-2xl font-semibold">{current.pressure} hPa</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="h-5 w-5 text-yellow-300" />
              <span className="text-sm text-white/80">Visibility</span>
            </div>
            <div className="text-2xl font-semibold">{current.visibility} km</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Sun className="h-5 w-5 text-orange-300" />
              <span className="text-sm text-white/80">UV Index</span>
            </div>
            <div className="text-2xl font-semibold">{current.uvIndex}</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Thermometer className="h-5 w-5 text-red-300" />
              <span className="text-sm text-white/80">Feels Like</span>
            </div>
            <div className="text-2xl font-semibold">{Math.round(feelsLike)}°</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;