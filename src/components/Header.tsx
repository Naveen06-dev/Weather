import React from 'react';
import { Search, MapPin, Thermometer, Cloud, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  onSearchClick: () => void;
  onLocationClick: () => void;
  onUnitToggle: () => void;
  unit: 'celsius' | 'fahrenheit';
}

const Header: React.FC<HeaderProps> = ({ 
  onSearchClick, 
  onLocationClick, 
  onUnitToggle, 
  unit 
}) => {
  const { theme, setTheme } = useTheme();
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 dark:bg-gray-900 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Cloud className="h-8 w-8 text-white dark:text-gray-200" />
            <h1 className="text-2xl font-bold text-white dark:text-gray-200">WeatherPro</h1>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onSearchClick}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search Location</span>
            </button>

            <button
              onClick={onLocationClick}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Current Location</span>
            </button>

            <button
              onClick={onUnitToggle}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              <Thermometer className="h-4 w-4" />
              <span className="font-medium">°{unit === 'celsius' ? 'C' : 'F'}</span>
            </button>

            {/* Dark/Light mode toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="hidden sm:inline">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;