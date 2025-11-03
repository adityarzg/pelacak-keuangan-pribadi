import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, TransactionCategory } from './types';
import Header from './components/Header';
import Summary from './components/Summary';
import TransactionList from './components/TransactionList';
import AddTransaction from './components/AddTransaction';
import Chart from './components/Chart';
import MonthNavigator from './components/MonthNavigator';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });
  const [viewDate, setViewDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<TransactionCategory | 'all'>('all');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handlePreviousMonth = () => {
    setViewDate(currentDate => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setViewDate(currentDate => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  
  const monthlyTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === viewDate.getFullYear() &&
             transactionDate.getMonth() === viewDate.getMonth();
    });
  }, [transactions, viewDate]);

  const { totalIncome, totalExpense } = useMemo(() => {
    const income = monthlyTransactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthlyTransactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalIncome: income, totalExpense: expense };
  }, [monthlyTransactions]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'date'>) => {
    const transactionWithId: Transaction = {
      ...newTransaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [transactionWithId, ...prev]);
    setViewDate(new Date());
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTransactions = useMemo(() => {
    return monthlyTransactions.filter(transaction => {
      const searchTermMatch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = filterCategory === 'all' || transaction.category === filterCategory;
      return searchTermMatch && categoryMatch;
    });
  }, [monthlyTransactions, searchTerm, filterCategory]);
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
  };

  const totalBalance = useMemo(() => {
      const income = transactions
        .filter((t) => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);
  
      const expense = transactions
        .filter((t) => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);
  
      return income - expense;
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-base p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header balance={totalBalance} />
        <MonthNavigator 
          viewDate={viewDate} 
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
        <main className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Summary income={totalIncome} expense={totalExpense} />
            <AddTransaction onAddTransaction={handleAddTransaction} />
            <TransactionList
              transactions={filteredTransactions}
              onDeleteTransaction={handleDeleteTransaction}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterCategory={filterCategory}
              onCategoryChange={setFilterCategory}
              onClearFilters={handleClearFilters}
            />
          </div>
          <div className="lg:col-span-1">
            <Chart transactions={monthlyTransactions} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;