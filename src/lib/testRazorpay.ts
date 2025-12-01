// Test Razorpay Integration
export const testRazorpayIntegration = () => {
  console.log('=== Razorpay Integration Test ===');
  
  // Check if Razorpay is loaded
  console.log('Razorpay SDK loaded:', !!window.Razorpay);
  
  // Check environment variables
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  console.log('Razorpay Key configured:', !!razorpayKey);
  console.log('Razorpay Key (first 10 chars):', razorpayKey?.substring(0, 10) || 'Not set');
  
  // Check API URL
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log('API URL:', apiUrl || 'Not set');
  
  // Test Razorpay test payment
  if (window.Razorpay && razorpayKey && razorpayKey !== 'rzp_test_your_key_id_here') {
    console.log('✅ Razorpay integration looks good!');
    console.log('💡 To test payment:');
    console.log('1. Use Razorpay test cards: https://razorpay.com/docs/payments/payments/test-card-details/');
    console.log('2. Test Card: 4111 1111 1111 1111, CVV: 123, Expiry: Any future date');
  } else {
    console.log('❌ Issues found:');
    if (!window.Razorpay) {
      console.log('- Razorpay SDK not loaded');
    }
    if (!razorpayKey || razorpayKey === 'rzp_test_your_key_id_here') {
      console.log('- Razorpay key not configured in environment variables');
    }
  }
};

// Add to window for easy access
if (typeof window !== 'undefined') {
  (window as any).testRazorpay = testRazorpayIntegration;
}