import { supabase, transactionService, authService } from '../services/supabase';

// Fungsi untuk menguji koneksi ke Supabase
export async function testSupabaseConnection() {
  try {
    // Cek koneksi dengan query sederhana
    const { data, error } = await supabase.from('transactions').select('count()', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Koneksi Supabase gagal:', error.message);
      return false;
    }
    
    console.log('✅ Koneksi Supabase berhasil!');
    return true;
  } catch (error: any) {
    console.error('❌ Koneksi Supabase gagal:', error.message);
    return false;
  }
}

// Fungsi untuk menguji operasi CRUD
export async function testCRUDOperations(userId: string) {
  try {
    console.log('🧪 Memulai test operasi CRUD...');
    
    // 1. CREATE: Tambah transaksi baru
    const newTransaction = {
      user_id: userId,
      amount: 50000,
      description: 'Test Transaction',
      category: 'Test',
      type: 'income',
      date: new Date().toISOString()
    };
    
    console.log('📝 Menambahkan transaksi baru...');
    const addResult = await transactionService.addTransaction(newTransaction);
    
    if (!addResult || addResult.length === 0) {
      throw new Error('Gagal menambahkan transaksi');
    }
    
    const transactionId = addResult[0].id;
    console.log(`✅ Transaksi berhasil ditambahkan dengan ID: ${transactionId}`);
    
    // 2. READ: Ambil transaksi yang baru ditambahkan
    console.log('📖 Mengambil transaksi...');
    const transactions = await transactionService.getTransactions(userId);
    
    const foundTransaction = transactions.find(t => t.id === transactionId);
    if (!foundTransaction) {
      throw new Error('Transaksi tidak ditemukan setelah ditambahkan');
    }
    
    console.log('✅ Transaksi berhasil diambil');
    
    // 3. UPDATE: Update transaksi
    console.log('✏️ Mengupdate transaksi...');
    const updates = {
      amount: 75000,
      description: 'Updated Test Transaction'
    };
    
    const updateResult = await transactionService.updateTransaction(transactionId, updates);
    
    if (!updateResult || updateResult.length === 0) {
      throw new Error('Gagal mengupdate transaksi');
    }
    
    console.log('✅ Transaksi berhasil diupdate');
    
    // 4. DELETE: Hapus transaksi
    console.log('🗑️ Menghapus transaksi...');
    const deleteResult = await transactionService.deleteTransaction(transactionId);
    
    if (!deleteResult) {
      throw new Error('Gagal menghapus transaksi');
    }
    
    console.log('✅ Transaksi berhasil dihapus');
    
    console.log('🎉 Semua operasi CRUD berhasil!');
    return true;
  } catch (error: any) {
    console.error('❌ Test CRUD gagal:', error.message);
    return false;
  }
}

// Fungsi untuk menjalankan semua test
export async function runAllTests() {
  console.log('🚀 Memulai test Supabase...');
  
  // Test koneksi
  const connectionSuccess = await testSupabaseConnection();
  if (!connectionSuccess) {
    console.error('❌ Test koneksi gagal, tidak melanjutkan test CRUD');
    return;
  }
  
  // Login untuk mendapatkan user ID
  try {
    console.log('🔑 Mencoba login untuk test CRUD...');
    // Ganti dengan email dan password yang valid
    const result = await authService.signIn('test@example.com', 'password123');
    
    if (!result.user) {
      throw new Error('Login gagal');
    }
    
    console.log('✅ Login berhasil');
    
    // Test CRUD dengan user ID yang didapat
    await testCRUDOperations(result.user.id);
    
    // Logout setelah selesai
    await authService.signOut();
    console.log('👋 Logout berhasil');
  } catch (error: any) {
    console.error('❌ Test autentikasi gagal:', error.message);
    console.log('⚠️ Pastikan Anda telah membuat user test di Supabase dan mengupdate kredensial di file test');
  }
  
  console.log('🏁 Test Supabase selesai');
}