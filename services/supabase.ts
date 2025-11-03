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

// Mendapatkan URL dan key Supabase dengan fallback untuk Cloudflare Workers
const getSupabaseCredentials = () => {
  // Untuk browser/Vite environment
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return {
      url: import.meta.env.VITE_SUPABASE_URL,
      key: import.meta.env.VITE_SUPABASE_ANON_KEY
    };
  }
  
  // Untuk Cloudflare Workers environment
  if (typeof process !== 'undefined' && process.env) {
    return {
      url: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
      key: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    };
  }
  
  // Fallback hardcoded (hanya untuk development)
  console.warn('Menggunakan kredensial Supabase hardcoded - JANGAN GUNAKAN DI PRODUCTION');
  return {
    url: 'https://fawlvefmiyufgmczzehh.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhd2x2ZWZtaXl1ZmdtY3p6ZWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDM1NTAsImV4cCI6MjA3NzcxOTU1MH0.r_YMEo_mvCSJnuc_oT1xPfoArRJzRtmJvd5R9c4DcLs'
  };
};

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseCredentials();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL dan Anon Key tidak tersedia');
}

// Konfigurasi client dengan opsi tambahan untuk Cloudflare
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Penting untuk Cloudflare Workers
  },
  global: {
    fetch: fetch // Menggunakan fetch global untuk kompatibilitas Cloudflare
  }
});

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