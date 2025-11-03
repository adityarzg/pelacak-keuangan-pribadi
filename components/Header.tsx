import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  balance: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);


const Header: React.FC<HeaderProps> = ({ balance }) => {
  const balanceColor = balance >= 0 ? 'text-income' : 'text-expense';
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-white dark:bg-surface rounded-xl shadow-lg p-6 flex flex-col sm:flex-row justify-between items-center">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Pelacak Keuangan
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola uang Anda dengan cerdas.</p>
        </div>
      </div>
      <div className="flex items-center gap-6 mt-4 sm:mt-0">
        <div className="text-center">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Saldo Saat Ini
          </h2>
          <p className={`text-3xl sm:text-4xl font-extrabold ${balanceColor}`}>
            {formatCurrency(balance)}
          </p>
        </div>
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-overlay"
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
};

export default Header;
