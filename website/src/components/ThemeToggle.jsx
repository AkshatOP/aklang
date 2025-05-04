import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <span className="text-2xl" role="img" aria-label="Light mode">☀️</span>
      ) : (
        <span className="text-2xl" role="img" aria-label="Dark mode">🌙</span>
      )}
    </button>
  );
};

export default ThemeToggle;