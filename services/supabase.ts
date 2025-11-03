import { createClient } from '@supabase/supabase-js';

// Deklarasi tipe untuk import.meta.env
declare global {
  interface ImportMeta {
    env: {
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
      [key: string]: any;
    };
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL dan Anon Key harus disediakan di file .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fungsi helper untuk transaksi
export const transactionService = {
  // Mendapatkan semua transaksi untuk user tertentu
  async getTransactions(userId: string, month?: number, year?: number) {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (month !== undefined && year !== undefined) {
      // Filter berdasarkan bulan dan tahun
      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 0).toISOString();
      
      query = query
        .gte('date', startDate)
        .lte('date', endDate);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    return data;
  },
  
  // Menambahkan transaksi baru
  async addTransaction(transaction: any) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select();
    
    if (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
    
    return data;
  },
  
  // Mengupdate transaksi
  async updateTransaction(id: string, updates: any) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
    
    return data;
  },
  
  // Menghapus transaksi
  async deleteTransaction(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
    
    return true;
  }
};

// Fungsi helper untuk autentikasi
export const authService = {
  // Mendaftarkan user baru
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing up:', error);
      throw error;
    }
    
    return data;
  },
  
  // Login user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }
    
    return data;
  },
  
  // Logout user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    
    return true;
  },
  
  // Mendapatkan user yang sedang login
  getCurrentUser() {
    return supabase.auth.getUser();
  },
  
  // Mendapatkan session
  getSession() {
    return supabase.auth.getSession();
  }
};