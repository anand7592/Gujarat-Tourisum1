import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  IndianRupee, 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle,
  AlertTriangle,
  Loader2,
  ArrowLeft
} from "lucide-react";
import type { Booking } from "@/types";
import api from "@/lib/api";

// Razorpay types
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
  notes?: {
    [key: string]: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

const Payment = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBooking(bookingId);
    }
  }, [bookingId]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    // Debug: Log current environment configuration
    console.log('Payment Environment Debug:', {
      apiUrl: import.meta.env.VITE_API_URL,
      razorpayKey: import.meta.env.VITE_RAZORPAY_KEY_ID ? 'Configured' : 'Not configured',
      bookingId: bookingId
    });
    
    return () => {
      document.body.removeChild(script);
    };
  }, [bookingId]);

  const fetchBooking = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/bookings/${id}`);
      setBooking(response.data);
    } catch (error: unknown) {
      console.error("Failed to fetch booking:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch booking details";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createRazorpayOrder = async () => {
    try {
      const response = await api.post(`/bookings/${bookingId}/create-order`);
      return response.data.orderId;
    } catch (error: unknown) {
      // Check if it's a 403/404 error (API not implemented or authentication issue)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: any } };
        if (axiosError.response?.status === 403) {
          console.error('403 Forbidden - Authentication or authorization failed:', axiosError.response?.data);
          throw new Error('BACKEND_NOT_READY');
        }
        if (axiosError.response?.status === 404) {
          console.error('404 Not Found - API endpoint not implemented:', axiosError.response?.data);
          throw new Error('BACKEND_NOT_READY');
        }
      }
      const errorMessage = error instanceof Error ? error.message : "Failed to create payment order";
      throw new Error(errorMessage);
    }
  };

  const verifyPayment = async (paymentDetails: RazorpayResponse) => {
    try {
      const response = await api.post(`/bookings/verify-payment`, {
        ...paymentDetails,
        bookingId: bookingId
      });
      return response.data;
    } catch (error: unknown) {
      // Check if it's a 403/404 error (API not implemented or authentication issue)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: any } };
        if (axiosError.response?.status === 403) {
          console.error('403 Forbidden - Payment verification failed:', axiosError.response?.data);
          throw new Error('BACKEND_NOT_READY');
        }
        if (axiosError.response?.status === 404) {
          console.error('404 Not Found - Payment verification endpoint not found:', axiosError.response?.data);
          throw new Error('BACKEND_NOT_READY');
        }
      }
      const errorMessage = error instanceof Error ? error.message : "Payment verification failed";
      throw new Error(errorMessage);
    }
  };

  const handlePayment = async () => {
    if (!booking) return;

    try {
      setProcessing(true);
      setError(null);

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please check your internet connection.');
      }
      
      // Check if Razorpay key is configured
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey || razorpayKey === 'rzp_test_your_key_id_here' || razorpayKey === 'rzp_test_your_actual_key_here') {
        // Development mode: Show option to simulate payment or configure Razorpay
        const useTestMode = confirm(
          'Razorpay key not configured.\n\n' +
          'Click OK to simulate payment success (development mode)\n' +
          'Click Cancel to configure Razorpay properly'
        );
        
        if (useTestMode) {
          // Simulate payment success
          setTimeout(async () => {
            try {
              // Simulate payment verification with mock data
              await verifyPayment({
                razorpay_payment_id: 'pay_test_' + Date.now(),
                razorpay_order_id: booking.razorpayOrderId || 'order_test_' + Date.now(),
                razorpay_signature: 'test_signature_' + Date.now()
              });
              
              alert('Payment simulated successfully! (Development Mode)');
              navigate('/dashboard/bookings');
            } catch (error: unknown) {
              const errorMessage = error instanceof Error ? error.message : "Payment simulation failed";
              setError(errorMessage);
            }
            setProcessing(false);
          }, 2000);
          return;
        } else {
          throw new Error('Please configure Razorpay: Get your key from https://dashboard.razorpay.com/app/keys and add it to .env as VITE_RAZORPAY_KEY_ID');
        }
      }
      
      // Try to create Razorpay order
      let orderId;
      try {
        orderId = await createRazorpayOrder();
        console.log('Created Razorpay order:', orderId);
      } catch (error: unknown) {
        // If backend is not ready, offer development mode
        if (error instanceof Error && error.message === 'BACKEND_NOT_READY') {
          const useTestMode = confirm(
            'Backend payment API not ready or authentication failed.\n\n' +
            'This might be because:\n' +
            '• Backend booking endpoints are not implemented\n' +
            '• Authentication token is expired or invalid\n' +
            '• CORS issues with the deployed backend\n\n' +
            'Click OK to simulate payment success (development mode)\n' +
            'Click Cancel to configure Razorpay properly'
          );
          
          if (useTestMode) {
            // Simulate payment success
            setTimeout(() => {
              alert('Payment simulated successfully! (Development Mode - Backend Not Ready)');
              navigate('/dashboard/bookings');
              setProcessing(false);
            }, 2000);
            return;
          } else {
            throw new Error('Backend payment system not ready. Please implement booking API endpoints or check authentication.');
          }
        }
        throw error;
      }

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: booking.finalAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'Gujarat Tourism',
        description: `Hotel Booking - ${typeof booking.hotel === 'object' ? booking.hotel.name : 'Hotel'}`,
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          console.log('Razorpay payment response:', response);
          
          try {
            // Validate response data
            if (!response.razorpay_payment_id || !response.razorpay_signature) {
              throw new Error('Invalid payment response from Razorpay');
            }
            
            // Verify payment
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };
            
            console.log('Sending payment verification:', paymentData);
            
            try {
              await verifyPayment(paymentData);
              // Show success message
              alert('Payment successful! Your booking has been confirmed.');
              // Redirect to bookings page
              navigate('/dashboard/bookings');
            } catch (verifyError: unknown) {
              // If verification fails due to backend issues, offer simulation
              if (verifyError instanceof Error && verifyError.message === 'BACKEND_NOT_READY') {
                const useTestMode = confirm(
                  'Payment completed but verification failed due to backend issues.\n\n' +
                  'Payment ID: ' + response.razorpay_payment_id + '\n\n' +
                  'Click OK to simulate payment success (development mode)\n' +
                  'Click Cancel to see the error'
                );
                
                if (useTestMode) {
                  alert('Payment verification simulated successfully! (Development Mode)\nPayment ID: ' + response.razorpay_payment_id);
                  navigate('/dashboard/bookings');
                  return;
                }
              }
              
              const errorMessage = verifyError instanceof Error ? verifyError.message : "Payment verification failed";
              setError(errorMessage);
              setProcessing(false);
            }
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Payment verification failed";
            setError(errorMessage);
            setProcessing(false);
          }
        },
        prefill: {
          name: booking.guestName,
          email: booking.guestEmail,
          contact: booking.guestPhone,
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed by user');
            setProcessing(false);
          }
        },
        notes: {
          booking_id: bookingId || '',
          guest_name: booking.guestName,
          guest_email: booking.guestEmail
        }
      };

      console.log('Opening Razorpay with options:', {
        ...options,
        key: '***hidden***' // Don't log the key
      });
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Payment setup failed";
      setError(errorMessage);
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-10">
          <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/dashboard/bookings')} variant="outline">
            Back to Bookings
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!booking || booking.paymentStatus !== 'Pending') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-10">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {booking?.paymentStatus === 'Paid' ? 'Already Paid' : 'Payment Not Required'}
          </h3>
          <p className="text-gray-600 mb-4">
            {booking?.paymentStatus === 'Paid' 
              ? 'This booking has already been paid for.' 
              : 'Payment is not required for this booking.'}
          </p>
          <Button onClick={() => navigate('/dashboard/bookings')} variant="outline">
            Back to Bookings
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/dashboard/bookings')}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-gray-600">Booking ID: {booking._id}</p>
        </div>
      </div>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hotel Info */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">
                {typeof booking.hotel === 'object' ? booking.hotel.name : 'Hotel Booking'}
              </h3>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin size={14} />
                {typeof booking.hotel === 'object' ? booking.hotel.location : 'Location'}
              </div>
            </div>
            <Badge className={booking.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              {booking.bookingStatus}
            </Badge>
          </div>

          <Separator />

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <span className="font-medium">Check-in:</span>
                <span>{formatDate(booking.checkInDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <span className="font-medium">Check-out:</span>
                <span>{formatDate(booking.checkOutDate)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-gray-400" />
                <span className="font-medium">Rooms:</span>
                <span>{booking.numberOfRooms}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-gray-400" />
                <span className="font-medium">Guests:</span>
                <span>{booking.numberOfGuests}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Pricing Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Price Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Room ({booking.roomType})</span>
                <span>₹{booking.pricePerNight} × {booking.numberOfNights} nights</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{booking.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span>₹{booking.taxAmount.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold text-green-600">
                <span>Total Amount</span>
                <span className="flex items-center">
                  <IndianRupee size={18} />
                  {booking.finalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Guest Information */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Guest Information</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>Name:</strong> {booking.guestName}</div>
              <div><strong>Email:</strong> {booking.guestEmail}</div>
              <div><strong>Phone:</strong> {booking.guestPhone}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CreditCard className="h-5 w-5" />
            Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle size={16} />
                <span className="font-medium">Payment Error</span>
              </div>
              <p className="text-red-600 mt-1 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <CreditCard size={16} />
              <span className="font-medium">Secure Payment with Razorpay</span>
            </div>
            <p className="text-blue-600 text-sm">
              Your payment is secured with 256-bit SSL encryption. We support UPI, Net Banking, Credit/Debit Cards, and Wallets.
            </p>
          </div>

          <div className="text-center">
            <Button 
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
            >
              {processing ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay ₹{booking.finalAmount.toLocaleString()}
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By proceeding with the payment, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;