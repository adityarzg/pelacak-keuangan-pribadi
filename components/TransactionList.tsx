import React from 'react';
import { Transaction, TransactionCategory } from '../types';
import TransactionItem from './TransactionItem';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterCategory: TransactionCategory | 'all';
  onCategoryChange: (category: TransactionCategory | 'all') => void;
  onClearFilters: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDeleteTransaction,
  searchTerm,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  onClearFilters,
}) => {
  const isAnyFilterActive = searchTerm || filterCategory !== 'all';

  return (
    <div className="bg-white dark:bg-surface rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Riwayat Transaksi Bulan Ini</h3>
      
      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 items-end">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Cari Deskripsi</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              id="search"
              type="text"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-gray-100 dark:bg-overlay border-gray-300 dark:border-gray-600 rounded-lg p-2.5 pl-10 text-gray-900 dark:text-white focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Kategori</label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => onCategoryChange(e.target.value as TransactionCategory | 'all')}
            className="w-full bg-gray-100 dark:bg-overlay border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
          >
            <option value="all">Semua Kategori</option>
            {Object.values(TransactionCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {isAnyFilterActive && (
          <div className="md:col-span-2">
            <button 
              onClick={onClearFilters}
              className="w-full text-sm text-primary hover:underline font-semibold mt-2"
            >
              Bersihkan Filter
            </button>
          </div>
        )}
      </div>

      {transactions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          {isAnyFilterActive ? "Tidak ada transaksi yang cocok dengan filter Anda." : "Belum ada transaksi di bulan ini."}
        </p>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={onDeleteTransaction}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;