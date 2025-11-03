import React from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === TransactionType.INCOME;
  const amountColor = isIncome ? 'text-income' : 'text-expense';
  const borderColor = isIncome ? 'border-income' : 'border-expense';

  return (
    <div className={`bg-gray-50 dark:bg-overlay p-4 rounded-lg flex items-center justify-between border-l-4 ${borderColor} transition-all hover:bg-gray-100 dark:hover:bg-gray-700/50`}>
      <div className="flex-1">
        <p className="font-bold text-gray-800 dark:text-white capitalize">{transaction.description}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category} &bull; {new Date(transaction.date).toLocaleDateString('id-ID')}</p>
      </div>
      <div className="flex items-center space-x-4">
        <p className={`font-semibold text-lg ${amountColor}`}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
        </p>
        <button
          onClick={() => onDelete(transaction.id)}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
          aria-label="Hapus transaksi"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
