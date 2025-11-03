
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum TransactionCategory {
  MAKANAN = 'Makanan & Minuman',
  TRANSPORTASI = 'Transportasi',
  GAJI = 'Gaji',
  HIBURAN = 'Hiburan',
  TAGIHAN = 'Tagihan & Utilitas',
  BELANJA = 'Belanja',
  KESEHATAN = 'Kesehatan',
  PENDIDIKAN = 'Pendidikan',
  INVESTASI = 'Investasi',
  LAINNYA = 'Lainnya',
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
}

export interface ChartData {
  name: string;
  value: number;
  // Fix(components/Chart.tsx line 56): Add an index signature to make the type compatible with the 'recharts' library, which expects a more generic object for its data prop. This resolves the type error.
  [key: string]: any;
}
