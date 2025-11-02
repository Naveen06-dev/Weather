import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherMap from './components/WeatherMap';
import SearchModal from './components/SearchModal';
import { WeatherData, Location } from './types/weather';
import { fetchWeatherData } from './services/weatherService';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const fetchCityInfo = async (lat: number, lon: number): Promise<{ name: string, region: string, country: string }> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      return {
        name: data.address.city || data.address.town || data.address.village || data.address.hamlet || data.address.county || data.display_name || 'Unknown Location',
        region: data.address.state || data.address.region || data.address.county || '',
        country: data.address.country || '',
      };
    } catch (e) {
      return { name: 'Unknown Location', region: '', country: '' };
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const cityInfo = await fetchCityInfo(latitude, longitude);
          await loadWeatherData(latitude, longitude, true, cityInfo);
        },
        async (error) => {
          console.error('Geolocation error:', error);
          const cityInfo = await fetchCityInfo(40.7128, -74.0060);
          loadWeatherData(40.7128, -74.0060, true, cityInfo);
        }
      );
    } else {
      fetchCityInfo(40.7128, -74.0060).then(cityInfo => {
        loadWeatherData(40.7128, -74.0060, true, cityInfo);
      });
    }
  };

  const loadWeatherData = async (lat: number, lon: number, showToast: boolean = false, cityInfo?: { name: string, region: string, country: string }) => {
    try {
      const data = await fetchWeatherData(lat, lon, cityInfo);
      setWeatherData(data);
      setCurrentLocation({ lat, lon, name: cityInfo?.name || data.location.name });
      if (showToast) {
        setToast(`Location: ${(cityInfo?.name || data.location.name)} (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      setError('Failed to load weather data. Please try again.');
      console.error('Weather data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (location: Location) => {
    setShowSearch(false);
    const cityInfo = await fetchCityInfo(location.lat, location.lon);
    await loadWeatherData(location.lat, location.lon, true, cityInfo);
  };

  const toggleUnit = () => {
    setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 dark:from-gray-900 dark:via-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-red-500 to-red-600 dark:from-red-900 dark:via-red-800 dark:to-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Weather data unavailable</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={getCurrentLocation}
            className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:text-red-300 dark:hover:bg-gray-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-black dark:from-gray-900 dark:to-black text-white dark:text-gray-200">
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 rounded-lg shadow-lg z-50 font-semibold animate-fade-in-out dark:bg-gray-800 dark:text-white">
          {toast}
        </div>
      )}
      <Header
        onSearchClick={() => setShowSearch(true)}
        onLocationClick={getCurrentLocation}
        onUnitToggle={toggleUnit}
        unit={unit}
      />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {currentLocation && (
          <div className="mb-4 p-4 bg-white/20 rounded-lg text-white flex flex-col items-center shadow dark:bg-gray-800 dark:text-gray-200">
            <div className="font-bold text-lg">Current Location</div>
            <div className="text-base">{currentLocation.name}</div>
            <div className="text-sm text-white/80 dark:text-gray-400">Lat: {currentLocation.lat.toFixed(4)}, Lon: {currentLocation.lon.toFixed(4)}</div>
          </div>
        )}
        {weatherData && (
          <>
            <CurrentWeather data={weatherData} unit={unit} />
            <HourlyForecast data={weatherData.hourly} unit={unit} />
            <DailyForecast data={weatherData.daily} unit={unit} />
            <WeatherMap location={currentLocation} />
          </>
        )}
      </main>

      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          onLocationSelect={handleLocationSelect}
        />
      )}
    </div>
  );
}

export default App;