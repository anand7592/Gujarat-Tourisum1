# 🔧 Razorpay Payment Setup Guide

## Quick Setup Steps

### 1. Get Your Razorpay Test Key
- Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
- Sign up or login to your account
- Navigate to **Settings** → **API Keys**
- Copy your **Test Key ID** (starts with `rzp_test_`)

### 2. Configure Environment Variable
Open your `.env.local` file and replace:

```bash
# Before (placeholder)
VITE_RAZORPAY_KEY_ID=rzp_test_your_actual_key_here

# After (your actual key)
VITE_RAZORPAY_KEY_ID=rzp_test_1234567890123456
```

### 3. Restart Development Server
```bash
npm run dev
```

### 4. Test Payment
- Navigate to a booking payment page
- Click "Pay ₹X,XXX" button
- Use Razorpay test cards:
  - **Card:** 4111 1111 1111 1111
  - **CVV:** 123
  - **Expiry:** Any future date (e.g., 12/25)

## Development Mode

If you haven't configured Razorpay yet, the payment system offers a **development mode**:

1. Click "Pay Now" without configuring Razorpay
2. Choose "OK" to simulate payment success
3. Booking status will update to "Confirmed"

This allows you to test the booking flow without setting up Razorpay immediately.

## Production Setup

For production deployment:
1. Replace test key with **live key** (`rzp_live_`)
2. Ensure your backend has proper Razorpay webhook handling
3. Test with real payment methods

## Need Help?

- **Razorpay Documentation:** https://razorpay.com/docs/
- **Test Cards:** https://razorpay.com/docs/payments/payments/test-card-details/
- **Integration Guide:** https://razorpay.com/docs/payments/payment-gateway/web-integration/