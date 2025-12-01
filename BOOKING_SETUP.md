# Booking System Setup Instructions

## Prerequisites
1. Complete backend booking system implementation (controllers, models, routes)
2. Razorpay account for payment processing
3. Frontend dependencies installed

## Environment Setup

1. **Copy Environment Variables**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure Razorpay**
   - Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Navigate to Settings > API Keys
   - Generate Test/Live API Keys
   - Update `.env.local` with your keys:
     ```
     REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
     RAZORPAY_KEY_SECRET=your_actual_secret_key
     ```

3. **API Configuration**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

## Backend API Requirements

The booking system expects these backend endpoints:

### Booking Endpoints
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get specific booking
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Cancel booking
- `PATCH /api/bookings/:id/status` - Update booking status (admin)

### Payment Endpoints
- `POST /api/bookings/:id/create-order` - Create Razorpay order
- `POST /api/bookings/:id/verify-payment` - Verify payment

### Hotel Endpoints
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get specific hotel

## Features Included

### 1. BookingForm Component
- Hotel selection dropdown
- Date range picker (check-in/check-out)
- Room type and quantity selection
- Guest information collection
- Pricing calculation with taxes
- Special requests input
- Form validation

### 2. BookingList Component
- Booking history display
- Status badges (Pending, Confirmed, Completed, Cancelled)
- Payment status indicators
- Booking details modal
- Cancellation functionality with reasons
- Admin status update actions
- Responsive design

### 3. Payment Integration
- Secure Razorpay payment gateway
- Order creation and verification
- Payment status tracking
- Booking confirmation flow
- Error handling and user feedback

### 4. Main Bookings Page
- Tabbed interface (List/New Booking)
- Statistics dashboard
- Search and filtering
- Responsive layout

## Usage

1. **Creating a Booking**
   - Navigate to Dashboard > Bookings
   - Click "New Booking" tab
   - Fill out booking form
   - Submit to create booking with "Pending" status

2. **Making Payment**
   - Go to booking list
   - Click "Pay Now" for pending payments
   - Complete Razorpay payment flow
   - Booking status updates to "Confirmed" on successful payment

3. **Managing Bookings**
   - View all bookings with filters
   - Cancel bookings (24+ hours before check-in)
   - Track payment and booking status

## Admin Features

Admins can:
- View all user bookings
- Update booking status (Confirm/Complete)
- Access additional booking management features

## Payment Flow

1. User creates booking → Status: "Pending", Payment: "Pending"
2. User initiates payment → Razorpay order created
3. Payment successful → Status: "Confirmed", Payment: "Paid"
4. Payment failed → Status remains "Pending"
5. Admin can complete booking after guest stay

## Security Notes

- Never expose `RAZORPAY_KEY_SECRET` in frontend code
- Use HTTPS in production
- Implement proper authentication checks
- Validate all API inputs on backend
- Use environment variables for sensitive data

## Troubleshooting

### Common Issues
1. **Payment not working**: Check Razorpay key configuration
2. **API errors**: Verify backend is running and endpoints exist
3. **Navigation issues**: Ensure routes are properly configured
4. **UI components missing**: Check if all Radix UI packages are installed

### Installation Commands
```bash
# Install required UI components
npm install @radix-ui/react-tabs @radix-ui/react-separator

# Install date picker (if needed)
npm install react-day-picker date-fns

# Install form validation (if needed)
npm install react-hook-form @hookform/resolvers zod
```

## Testing

1. Test booking creation with various hotel selections
2. Test payment flow with Razorpay test cards
3. Test cancellation functionality
4. Test admin status updates
5. Verify responsive design on different devices
6. Test error handling scenarios

## Production Deployment

1. Replace test Razorpay keys with live keys
2. Update API URL to production backend
3. Enable HTTPS
4. Configure proper CORS settings
5. Test payment flow with real payment methods

## Support

For issues with:
- Razorpay integration: Check Razorpay documentation
- UI components: Refer to Radix UI documentation
- Backend APIs: Ensure backend implementation matches expected endpoints