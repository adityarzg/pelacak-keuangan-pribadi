// Script untuk mendiagnosis masalah koneksi Cloudflare-Supabase
import { createClient } from '@supabase/supabase-js';

// Konfigurasi Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://fawlvefmiyufgmczzehh.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhd2x2ZWZtaXl1ZmdtY3p6ZWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDM1NTAsImV4cCI6MjA3NzcxOTU1MH0.r_YMEo_mvCSJnuc_oT1xPfoArRJzRtmJvd5R9c4DcLs';

// Inisialisasi Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 1. Test koneksi dasar ke Supabase
async function testConnection() {
  console.log('🔍 Menguji koneksi ke Supabase...');
  try {
    const { data, error } = await supabase.from('transactions').select('count()', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Koneksi gagal:', error.message);
      return false;
    }
    
    console.log('✅ Koneksi berhasil!');
    return true;
  } catch (error) {
    console.error('❌ Error koneksi:', error.message);
    return false;
  }
}

// 2. Test CORS dengan simulasi request dari Cloudflare
async function testCORS() {
  console.log('🔍 Menguji konfigurasi CORS...');
  try {
    const headers = {
      'Origin': 'https://keuanganku.pages.dev', // Ganti dengan domain Cloudflare Anda
      'Referer': 'https://keuanganku.pages.dev/'
    };
    
    // Menggunakan fetch API untuk mensimulasikan request dari Cloudflare
    const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions?select=count`, {
      method: 'GET',
      headers: {
        ...headers,
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (!response.ok) {
      console.error('❌ CORS test gagal:', await response.text());
      return false;
    }
    
    console.log('✅ CORS test berhasil!');
    return true;
  } catch (error) {
    console.error('❌ CORS error:', error.message);
    return false;
  }
}

// 3. Test insert data ke Supabase
async function testInsert() {
  console.log('🔍 Menguji insert data ke Supabase...');
  try {
    // Login terlebih dahulu untuk mendapatkan user_id
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com', // Ganti dengan email yang valid
      password: 'password123'    // Ganti dengan password yang valid
    });
    
    if (authError) {
      console.error('❌ Login gagal:', authError.message);
      return false;
    }
    
    const userId = authData.user.id;
    console.log('✅ Login berhasil, user ID:', userId);
    
    // Coba insert data
    const testTransaction = {
      user_id: userId,
      amount: 10000,
      description: 'Test Transaction from Debug Script',
      category: 'Test',
      type: 'income',
      date: new Date().toISOString()
    };
    
    console.log('📝 Mencoba insert data:', testTransaction);
    
    const { data, error } = await supabase
      .from('transactions')
      .insert(testTransaction)
      .select();
    
    if (error) {
      console.error('❌ Insert gagal:', error.message);
      if (error.code === '42501') {
        console.error('❗ Kemungkinan masalah RLS policy. Periksa kebijakan akses di Supabase.');
      }
      return false;
    }
    
    console.log('✅ Insert berhasil! Data:', data);
    return true;
  } catch (error) {
    console.error('❌ Error saat insert:', error.message);
    return false;
  }
}

// 4. Test dengan logging detail
async function testWithDetailedLogging() {
  console.log('🔍 Menjalankan test dengan logging detail...');
  try {
    // Tambahkan interceptor untuk logging request
    const originalFetch = global.fetch;
    global.fetch = async (...args) => {
      console.log('🌐 Fetch request:', args[0], args[1]?.method || 'GET');
      try {
        const response = await originalFetch(...args);
        console.log('🌐 Fetch response status:', response.status);
        return response;
      } catch (error) {
        console.error('🌐 Fetch error:', error.message);
        throw error;
      }
    };
    
    // Test insert dengan logging
    const result = await testInsert();
    
    // Kembalikan fetch asli
    global.fetch = originalFetch;
    
    return result;
  } catch (error) {
    console.error('❌ Error dalam detailed logging test:', error.message);
    return false;
  }
}

// Jalankan semua test
async function runAllTests() {
  console.log('🚀 Memulai diagnosa masalah Cloudflare-Supabase...');
  
  // Test koneksi dasar
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.error('❌ Koneksi dasar gagal, tidak melanjutkan test lain.');
    return;
  }
  
  // Test CORS
  const corsOk = await testCORS();
  if (!corsOk) {
    console.warn('⚠️ CORS test gagal, tapi melanjutkan test lain...');
  }
  
  // Test insert data
  const insertOk = await testInsert();
  if (!insertOk) {
    console.error('❌ Insert data gagal.');
    console.log('🔍 Menjalankan test dengan logging detail...');
    await testWithDetailedLogging();
  }
  
  console.log('🏁 Diagnosa selesai.');
}

// Jalankan diagnosa
runAllTests().catch(error => {
  console.error('❌ Error tidak tertangani:', error);
});