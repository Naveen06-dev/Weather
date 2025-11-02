import React from 'react';
import { DailyWeather } from '../types/weather';
import { convertTemperature, getWeatherIcon } from '../utils/weatherUtils';

interface DailyForecastProps {
  data: DailyWeather[];
  unit: 'celsius' | 'fahrenheit';
}

const DailyForecast: React.FC<DailyForecastProps> = ({ data, unit }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
      <h3 className="text-xl font-semibold mb-4">7-Day Forecast</h3>
      
      <div className="space-y-3">
        {data.map((day, index) => {
          const date = new Date(day.date);
          const high = convertTemperature(day.high, unit);
          const low = convertTemperature(day.low, unit);
          const WeatherIcon = getWeatherIcon(day.icon);
          
          return (
            <div
              key={index}
              className="flex items-center justify-between bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-20 text-left">
                  <div className="font-medium">
                    {index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-sm text-white/60">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                
                <WeatherIcon className="h-8 w-8" />
                
                <div className="flex-1">
                  <div className="capitalize font-medium">{day.condition}</div>
                  <div className="text-sm text-white/60">
                    {day.precipitation}% chance of rain
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-right">
                <div className="text-sm text-white/60">
                  <div>💨 {day.windSpeed} km/h</div>
                  <div>💧 {day.humidity}%</div>
                </div>
                
                <div className="text-lg font-semibold">
                  <span>{Math.round(high)}°</span>
                  <span className="text-white/60 ml-2">{Math.round(low)}°</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;