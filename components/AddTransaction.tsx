import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, TransactionCategory } from '../types';
import { incomeCategories, expenseCategories } from '../constants';

interface AddTransactionProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onAddTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<TransactionCategory>(expenseCategories[0]);
  const [categories, setCategories] = useState<TransactionCategory[]>(expenseCategories);

  useEffect(() => {
    if (type === TransactionType.INCOME) {
      setCategories(incomeCategories);
      setCategory(incomeCategories[0]);
    } else {
      setCategories(expenseCategories);
      setCategory(expenseCategories[0]);
    }
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!description.trim() || isNaN(numericAmount) || numericAmount <= 0) {
        alert("Harap isi semua kolom dengan benar.");
        return;
    }

    onAddTransaction({ description, amount: numericAmount, type, category });
    
    setDescription('');
    setAmount('');
  };

  return (
    <div className="bg-white dark:bg-surface rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Tambah Transaksi Baru</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4 mb-4">
            <label className="flex-1">
                <input type="radio" name="type" value={TransactionType.EXPENSE} checked={type === TransactionType.EXPENSE} onChange={() => setType(TransactionType.EXPENSE)} className="sr-only peer" />
                <div className="w-full text-center py-2 px-4 rounded-lg cursor-pointer font-semibold border-2 border-gray-200 dark:border-overlay text-gray-700 dark:text-gray-300 peer-checked:bg-expense peer-checked:text-white peer-checked:border-expense transition-all">Pengeluaran</div>
            </label>
            <label className="flex-1">
                <input type="radio" name="type" value={TransactionType.INCOME} checked={type === TransactionType.INCOME} onChange={() => setType(TransactionType.INCOME)} className="sr-only peer" />
                <div className="w-full text-center py-2 px-4 rounded-lg cursor-pointer font-semibold border-2 border-gray-200 dark:border-overlay text-gray-700 dark:text-gray-300 peer-checked:bg-income peer-checked:text-white peer-checked:border-income transition-all">Pemasukan</div>
            </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Deskripsi</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Makan siang"
              className="w-full bg-gray-100 dark:bg-overlay border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Jumlah (Rp)</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Contoh: 50000"
              className="w-full bg-gray-100 dark:bg-overlay border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Kategori</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as TransactionCategory)}
            className="w-full bg-gray-100 dark:bg-overlay border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
          Tambah Transaksi
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
