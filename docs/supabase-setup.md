# Dokumentasi Setup Supabase

## Langkah-langkah Setup

### 1. Membuat Project Supabase

1. Kunjungi [Supabase Dashboard](https://app.supabase.io/)
2. Login atau buat akun baru
3. Klik "New Project"
4. Isi detail project:
   - Nama project: `pelacak-keuangan-pribadi`
   - Database password: (buat password yang kuat)
   - Region: (pilih region terdekat)
5. Klik "Create new project"

### 2. Mendapatkan Credentials

Setelah project dibuat:

1. Buka project di dashboard Supabase
2. Klik "Settings" di sidebar kiri
3. Klik "API" di submenu
4. Salin "URL" dan "anon public" key
5. Tambahkan credentials ke file `.env`:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### 3. Membuat Struktur Database

#### Tabel Transactions

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount DECIMAL(12,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Setup Row Level Security (RLS)

Aktifkan RLS untuk tabel transactions:

```sql
-- Aktifkan RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Buat policy untuk membaca data
CREATE POLICY "Users can view their own transactions" 
ON transactions FOR SELECT 
USING (auth.uid() = user_id);

-- Buat policy untuk menambah data
CREATE POLICY "Users can insert their own transactions" 
ON transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Buat policy untuk mengupdate data
CREATE POLICY "Users can update their own transactions" 
ON transactions FOR UPDATE
USING (auth.uid() = user_id);

-- Buat policy untuk menghapus data
CREATE POLICY "Users can delete their own transactions" 
ON transactions FOR DELETE
USING (auth.uid() = user_id);
```

### 5. Penggunaan di Aplikasi

Koneksi ke Supabase sudah dikonfigurasi di file `services/supabase.ts`. Untuk menggunakan service:

```typescript
import { supabase, transactionService, authService } from '../services/supabase';

// Contoh penggunaan autentikasi
const login = async () => {
  try {
    const { user } = await authService.signIn('email@example.com', 'password');
    console.log('Login berhasil:', user);
  } catch (error) {
    console.error('Login gagal:', error);
  }
};

// Contoh penggunaan transaksi
const getTransactions = async () => {
  try {
    const { data: session } = await authService.getSession();
    if (session?.user) {
      const transactions = await transactionService.getTransactions(session.user.id);
      console.log('Transaksi:', transactions);
    }
  } catch (error) {
    console.error('Gagal mendapatkan transaksi:', error);
  }
};
```

### 6. Testing

Untuk menguji koneksi dan operasi CRUD:

1. Pastikan kredensial Supabase sudah benar di file `.env`
2. Jalankan aplikasi dengan `npm run dev`
3. Buka browser dan coba login/register
4. Coba tambah, lihat, edit, dan hapus transaksi

### 7. Troubleshooting

- **Error koneksi**: Periksa URL dan API key di file `.env`
- **Error autentikasi**: Pastikan email confirmation diaktifkan/dinonaktifkan sesuai kebutuhan di dashboard Supabase
- **Error RLS**: Pastikan policy sudah dibuat dengan benar dan RLS diaktifkan

### 8. Referensi

- [Dokumentasi Supabase](https://supabase.io/docs)
- [Supabase JavaScript Client](https://supabase.io/docs/reference/javascript/installing)
- [Row Level Security](https://supabase.io/docs/guides/auth/row-level-security)