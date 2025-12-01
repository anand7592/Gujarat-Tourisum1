import api from '@/lib/api';

// Debug function to test authentication
export const debugAuth = async () => {
  console.log('=== Authentication Debug ===');
  
  // Check stored data
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  console.log('Stored user:', user ? JSON.parse(user) : 'None');
  console.log('Stored token:', token || 'None');
  
  // Test API calls
  try {
    console.log('Testing /bookings endpoint...');
    const bookingsResponse = await api.get('/bookings');
    console.log('Bookings response:', bookingsResponse.data);
  } catch (error: unknown) {
    console.error('Bookings error:', error);
  }
  
  try {
    console.log('Testing auth verification...');
    const authResponse = await api.get('/auth/verify');
    console.log('Auth verification:', authResponse.data);
  } catch (error: unknown) {
    console.error('Auth verification error:', error);
  }
};

// Add to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).debugAuth = debugAuth;
}