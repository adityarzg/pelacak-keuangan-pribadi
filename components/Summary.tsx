import React from 'react';

interface SummaryProps {
  income: number;
  expense: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const ArrowUpIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
    </svg>
)

const ArrowDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m0 0l-7-7m7 7l7-7" />
    </svg>
)

const Summary: React.FC<SummaryProps> = ({ income, expense }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-surface rounded-xl shadow-lg p-6 flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-sm font-medium">Pemasukan</h3>
          <p className="text-2xl font-bold text-income">{formatCurrency(income)}</p>
        </div>
        <div className="bg-income/20 p-3 rounded-full">
            <ArrowUpIcon className="h-6 w-6 text-income" />
        </div>
      </div>
      <div className="bg-white dark:bg-surface rounded-xl shadow-lg p-6 flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-sm font-medium">Pengeluaran</h3>
          <p className="text-2xl font-bold text-expense">{formatCurrency(expense)}</p>
        </div>
        <div className="bg-expense/20 p-3 rounded-full">
            <ArrowDownIcon className="h-6 w-6 text-expense" />
        </div>
      </div>
    </div>
  );
};

export default Summary;
