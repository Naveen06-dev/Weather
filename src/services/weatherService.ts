import { WeatherData } from '../types/weather';

// Mock weather data generator for demonstration
export const fetchWeatherData = async (
  lat: number,
  lon: number,
  cityInfo?: { name: string; region: string; country: string }
): Promise<WeatherData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Generate mock data based on coordinates
  const locationNames = [
    'New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Los Angeles', 
    'Chicago', 'Miami', 'Seattle', 'Denver', 'Phoenix', 'Boston'
  ];
  
  const conditions = ['sunny', 'cloudy', 'partly-cloudy', 'rainy', 'stormy'];
  const descriptions = {
    'sunny': 'Clear sky',
    'cloudy': 'Overcast',
    'partly-cloudy': 'Partly cloudy',
    'rainy': 'Light rain',
    'stormy': 'Thunderstorms'
  };

  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const baseTemp = Math.floor(Math.random() * 30) + 5; // 5-35°C

  // Generate hourly data
  const hourly = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date();
    hour.setHours(hour.getHours() + i);
    
    return {
      time: hour.toISOString(),
      temperature: baseTemp + Math.floor(Math.random() * 10) - 5,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      icon: conditions[Math.floor(Math.random() * conditions.length)],
      precipitation: Math.floor(Math.random() * 100)
    };
  });

  // Generate daily data
  const daily = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    return {
      date: date.toISOString(),
      high: baseTemp + Math.floor(Math.random() * 8),
      low: baseTemp - Math.floor(Math.random() * 8),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      icon: conditions[Math.floor(Math.random() * conditions.length)],
      precipitation: Math.floor(Math.random() * 100),
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5
    };
  });

  return {
    location: {
      name: cityInfo?.name || locationNames[Math.floor(Math.random() * locationNames.length)],
      region: cityInfo?.region || 'Region',
      country: cityInfo?.country || 'Country',
    },
    current: {
      temperature: baseTemp,
      condition: randomCondition,
      description: descriptions[randomCondition as keyof typeof descriptions],
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      windDirection: Math.floor(Math.random() * 360),
      pressure: Math.floor(Math.random() * 50) + 1000,
      visibility: Math.floor(Math.random() * 10) + 5,
      uvIndex: Math.floor(Math.random() * 11),
      feelsLike: baseTemp + Math.floor(Math.random() * 6) - 3,
      icon: randomCondition
    },
    hourly,
    daily
  };
};

export const searchLocations = async (query: string) => {
  // Use OpenStreetMap Nominatim API for real location search, filtered to India
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=8&countrycodes=in`;
  const response = await fetch(url);
  const data = await response.json();
  // Map results to Location type
  return data.map((item: any) => ({
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    name:
      item.display_name ||
      item.address.city ||
      item.address.town ||
      item.address.village ||
      item.address.hamlet ||
      'Unknown Location',
  }));
};