// Skrip pengujian langsung ke Supabase tanpa melalui Cloudflare
import { createClient } from '@supabase/supabase-js';

// Konfigurasi Supabase
const SUPABASE_URL = 'https://fawlvefmiyufgmczzehh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhd2x2ZWZtaXl1ZmdtY3p6ZWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDM1NTAsImV4cCI6MjA3NzcxOTU1MH0.r_YMEo_mvCSJnuc_oT1xPfoArRJzRtmJvd5R9c4DcLs';

// Inisialisasi Supabase client dengan opsi khusus
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false
  }
});

// Fungsi untuk menguji koneksi dan insert data
async function testSupabaseConnection() {
  console.log('🔍 Menguji koneksi langsung ke Supabase...');
  
  try {
    // 1. Test koneksi dasar
    const { data: countData, error: countError } = await supabase
      .from('transactions')
      .select('count()', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Koneksi gagal:', countError.message);
      return;
    }
    
    console.log('✅ Koneksi berhasil!');
    
    // 2. Login untuk mendapatkan user_id
    console.log('🔑 Mencoba login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com', // Ganti dengan email yang valid
      password: 'password123'    // Ganti dengan password yang valid
    });
    
    if (authError) {
      console.error('❌ Login gagal:', authError.message);
      console.log('⚠️ Mencoba insert data tanpa autentikasi...');
    } else {
      console.log('✅ Login berhasil! User ID:', authData.user.id);
    }
    
    // 3. Insert data transaksi
    const userId = authData?.user?.id || '00000000-0000-0000-0000-000000000000';
    
    const testTransaction = {
      user_id: userId,
      amount: 15000,
      description: 'Test Langsung ke Supabase',
      category: 'Test',
      type: 'income',
      date: new Date().toISOString()
    };
    
    console.log('📝 Mencoba insert data:', testTransaction);
    
    const { data: insertData, error: insertError } = await supabase
      .from('transactions')
      .insert(testTransaction)
      .select();
    
    if (insertError) {
      console.error('❌ Insert gagal:', insertError);
      
      if (insertError.code === '42501') {
        console.error('❗ Masalah RLS policy. Periksa kebijakan akses di Supabase.');
      }
      
      // Coba dengan opsi tambahan untuk debugging
      console.log('🔄 Mencoba lagi dengan headers tambahan...');
      
      const { data: retryData, error: retryError } = await supabase
        .from('transactions')
        .insert(testTransaction, { 
          headers: { 
            'Prefer': 'return=representation',
            'Content-Type': 'application/json'
          }
        })
        .select();
      
      if (retryError) {
        console.error('❌ Percobaan ulang gagal:', retryError);
      } else {
        console.log('✅ Percobaan ulang berhasil! Data:', retryData);
      }
    } else {
      console.log('✅ Insert berhasil! Data:', insertData);
    }
    
  } catch (error) {
    console.error('❌ Error tidak tertangani:', error);
  }
}

// Jalankan test
testSupabaseConnection().then(() => {
  console.log('🏁 Test selesai');
});