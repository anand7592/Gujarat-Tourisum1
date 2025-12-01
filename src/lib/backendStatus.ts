import api from '@/lib/api';

export const checkBackendStatus = async () => {
  const endpoints = [
    { name: 'Hotels', path: '/hotels' },
    { name: 'Bookings', path: '/bookings' },
    { name: 'Auth Check', path: '/auth/verify' },
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      await api.get(endpoint.path);
      results.push({ ...endpoint, status: 'available', error: null });
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: any } };
        results.push({
          ...endpoint,
          status: axiosError.response?.status === 404 ? 'not-implemented' : 'error',
          error: axiosError.response?.status || 'network-error'
        });
      } else {
        results.push({
          ...endpoint,
          status: 'network-error',
          error: 'Cannot connect to backend'
        });
      }
    }
  }

  return results;
};