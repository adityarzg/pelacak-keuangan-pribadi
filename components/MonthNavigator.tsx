import React from 'react';

interface MonthNavigatorProps {
  viewDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({ viewDate, onPreviousMonth, onNextMonth }) => {
  const monthName = viewDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="flex items-center justify-center gap-4 my-6">
      <button 
        onClick={onPreviousMonth} 
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-overlay transition-colors"
        aria-label="Bulan Sebelumnya"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h2 className="text-xl font-bold text-center w-48 text-gray-800 dark:text-gray-200">
        {monthName}
      </h2>
      <button 
        onClick={onNextMonth} 
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-overlay transition-colors"
        aria-label="Bulan Berikutnya"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default MonthNavigator;