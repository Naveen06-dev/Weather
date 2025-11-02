import React from 'react';
import { HourlyWeather } from '../types/weather';
import { convertTemperature, getWeatherIcon } from '../utils/weatherUtils';

interface HourlyForecastProps {
  data: HourlyWeather[];
  unit: 'celsius' | 'fahrenheit';
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, unit }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
      <h3 className="text-xl font-semibold mb-4">24-Hour Forecast</h3>
      
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-2">
          {data.slice(0, 24).map((hour, index) => {
            const time = new Date(hour.time);
            const temp = convertTemperature(hour.temperature, unit);
            const WeatherIcon = getWeatherIcon(hour.icon);
            
            return (
              <div
                key={index}
                className="flex-shrink-0 bg-white/10 rounded-xl p-4 text-center min-w-[100px] hover:bg-white/20 transition-colors"
              >
                <div className="text-sm text-white/80 mb-2">
                  {index === 0 ? 'Now' : time.toLocaleTimeString('en-US', { 
                    hour: 'numeric',
                    hour12: true 
                  })}
                </div>
                
                <WeatherIcon className="h-8 w-8 mx-auto mb-2" />
                
                <div className="text-lg font-semibold mb-1">
                  {Math.round(temp)}°
                </div>
                
                <div className="text-xs text-blue-300">
                  {hour.precipitation}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;