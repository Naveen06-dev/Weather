export interface Location {
  lat: number;
  lon: number;
  name: string;
}

export interface CurrentWeather {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  feelsLike: number;
  icon: string;
}

export interface HourlyWeather {
  time: string;
  temperature: number;
  condition: string;
  icon: string;
  precipitation: number;
}

export interface DailyWeather {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

export interface WeatherData {
  location: {
    name: string;
    country: string;
    region: string;
  };
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
}