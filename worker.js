// Cloudflare Worker untuk mendiagnosis masalah koneksi Supabase

// Konfigurasi Supabase
const SUPABASE_URL = 'https://fawlvefmiyufgmczzehh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhd2x2ZWZtaXl1ZmdtY3p6ZWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDM1NTAsImV4cCI6MjA3NzcxOTU1MH0.r_YMEo_mvCSJnuc_oT1xPfoArRJzRtmJvd5R9c4DcLs';

// Fungsi untuk menangani request
async function handleRequest(request) {
  // Ekstrak path dari URL
  const url = new URL(request.url);
  const path = url.pathname;

  // Logging untuk debugging
  console.log(`Menerima request: ${request.method} ${path}`);

  // Endpoint untuk test koneksi
  if (path === '/api/test-connection') {
    return testConnection();
  }
  
  // Endpoint untuk test insert data
  if (path === '/api/test-insert') {
    return testInsert(request);
  }
  
  // Endpoint untuk test CORS
  if (path === '/api/test-cors') {
    return testCORS();
  }

  // Default response
  return new Response(JSON.stringify({
    message: 'Cloudflare Worker untuk diagnosa Supabase',
    endpoints: [
      '/api/test-connection',
      '/api/test-insert',
      '/api/test-cors'
    ]
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

// Test koneksi ke Supabase
async function testConnection() {
  try {
    console.log('Menguji koneksi ke Supabase...');
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions?select=count`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    const result = await response.json();
    
    return new Response(JSON.stringify({
      success: response.ok,
      status: response.status,
      result: result
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error koneksi:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Test insert data ke Supabase
async function testInsert(request) {
  try {
    console.log('Menguji insert data ke Supabase...');
    
    // Parse body jika ada
    let userData = null;
    if (request.method === 'POST') {
      try {
        userData = await request.json();
      } catch (e) {
        console.log('Tidak ada body atau format tidak valid');
      }
    }
    
    // Default test data jika tidak ada input
    const testData = userData || {
      user_id: '00000000-0000-0000-0000-000000000000', // Ganti dengan user ID yang valid
      amount: 10000,
      description: 'Test dari Cloudflare Worker',
      category: 'Test',
      type: 'income',
      date: new Date().toISOString()
    };
    
    console.log('Data yang akan diinsert:', testData);
    
    // Coba insert data
    const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    return new Response(JSON.stringify({
      success: response.ok,
      status: response.status,
      result: result
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error insert:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Test CORS dengan Supabase
async function testCORS() {
  try {
    console.log('Menguji konfigurasi CORS...');
    
    // Simulasi request dengan Origin header
    const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions?select=count`, {
      method: 'GET',
      headers: {
        'Origin': 'https://keuanganku.pages.dev', // Ganti dengan domain Cloudflare Anda
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    // Periksa header CORS
    const corsHeaders = {
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
      'access-control-allow-headers': response.headers.get('access-control-allow-headers')
    };
    
    return new Response(JSON.stringify({
      success: response.ok,
      status: response.status,
      corsHeaders: corsHeaders
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error CORS test:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Event listener untuk request
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});