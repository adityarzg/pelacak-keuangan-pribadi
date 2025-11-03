import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction, TransactionType, ChartData } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface ChartProps {
  transactions: Transaction[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#f59e0b', '#6366f1', '#d946ef'];

const Chart: React.FC<ChartProps> = ({ transactions }) => {
  const { resolvedTheme } = useTheme();

  const expenseData: ChartData[] = useMemo(() => {
    const expenseByCategory = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((acc, transaction) => {
        const { category, amount } = transaction;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += amount;
        return acc;
      }, {} as { [key: string]: number });

    return Object.entries(expenseByCategory).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      const formattedValue = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(value);
      return (
        <div className="bg-white dark:bg-overlay p-3 rounded-lg border border-gray-300 dark:border-gray-600">
          <p className="text-gray-800 dark:text-gray-300">{`${name} : ${formattedValue}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-surface rounded-xl shadow-lg p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Rincian Pengeluaran</h3>
      {expenseData.length > 0 ? (
        <div className="flex-grow w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {expenseData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                iconSize={10} 
                layout="vertical" 
                verticalAlign="middle" 
                align="right" 
                wrapperStyle={{ color: resolvedTheme === 'dark' ? '#d1d5db' : '#4b5563' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Data pengeluaran tidak cukup untuk menampilkan chart.</p>
        </div>
      )}
    </div>
  );
};

export default Chart;
