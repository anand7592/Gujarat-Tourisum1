import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Booking } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Phone, 
  Mail, 
  CreditCard, 
  Eye, 
  X, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  IndianRupee
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,

  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

interface BookingListProps {
  bookings: Booking[];
  onBookingUpdate: () => void;
  isAdmin?: boolean;
}

const BookingList = ({ bookings, onBookingUpdate, isAdmin = false }: BookingListProps) => {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "Refunded":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle size={16} className="text-green-600" />;
      case "Pending":
        return <Clock size={16} className="text-yellow-600" />;
      case "Cancelled":
        return <X size={16} className="text-red-600" />;
      case "Completed":
        return <CheckCircle size={16} className="text-blue-600" />;
      default:
        return <AlertTriangle size={16} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canBeCancelled = (booking: Booking) => {
    const now = new Date();
    const checkIn = new Date(booking.checkInDate);
    const hoursUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return booking.bookingStatus !== 'Cancelled' && 
           booking.bookingStatus !== 'Completed' && 
           hoursUntilCheckIn > 24;
  };

  const canShowCancelButton = (booking: Booking) => {
    return booking.bookingStatus !== 'Cancelled' && 
           booking.bookingStatus !== 'Completed';
  };

  const handleCancelClick = (booking: Booking) => {
    const now = new Date();
    const checkIn = new Date(booking.checkInDate);
    const hoursUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilCheckIn <= 24) {
      alert("Booking cannot be cancelled at this time. Must be cancelled at least 24 hours before check-in.");
      return false;
    }
    return true;
  };

  const handlePayment = async (bookingId: string) => {
    navigate(`/dashboard/booking/${bookingId}/payment`);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!cancellationReason.trim()) {
      alert("Please provide a cancellation reason");
      return;
    }

    try {
      setLoading(bookingId);
      await api.delete(`/bookings/${bookingId}`, {
        data: { cancellationReason }
      });
      
      setCancellationReason("");
      setSelectedBooking(null);
      onBookingUpdate();
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to cancel booking";
      alert(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      setLoading(bookingId);
      await api.patch(`/bookings/${bookingId}/status`, {
        bookingStatus: status
      });
      onBookingUpdate();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update booking status";
      alert(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <Card className="text-center py-10">
        <CardContent>
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Bookings Found</h3>
          <p className="text-gray-500 mb-4">
            {/* Check if this is due to missing API or actually no bookings */}
            You haven't made any bookings yet, or the booking API endpoints are not implemented.
          </p>
          <div className="space-y-2">
            <Button onClick={() => navigate('/dashboard/hotel')} className="bg-blue-600 hover:bg-blue-700">
              Browse Hotels
            </Button>
            <div className="text-xs text-gray-400 mt-2">
              💡 If you're seeing this during development, implement the booking API endpoints first.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <Card key={booking._id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg text-gray-800 mb-2">
                  {typeof booking.hotel === 'object' ? booking.hotel.name : 'Hotel Booking'}
                </CardTitle>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin size={14} />
                  {typeof booking.hotel === 'object' ? booking.hotel.location : 'Location'}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <Badge className={getStatusColor(booking.bookingStatus)}>
                    {getStatusIcon(booking.bookingStatus)}
                    <span className="ml-1">{booking.bookingStatus}</span>
                  </Badge>
                  <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                    <CreditCard size={12} className="mr-1" />
                    {booking.paymentStatus}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600 flex items-center">
                    <IndianRupee size={16} />
                    {booking.finalAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Total Amount</div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Booking Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <div>
                  <div className="font-medium">Check-in</div>
                  <div className="text-gray-600">{formatDate(booking.checkInDate)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <div>
                  <div className="font-medium">Check-out</div>
                  <div className="text-gray-600">{formatDate(booking.checkOutDate)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users size={14} className="text-gray-400" />
                <div>
                  <div className="font-medium">{booking.numberOfRooms} Room(s)</div>
                  <div className="text-gray-600">{booking.numberOfGuests} Guest(s)</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Guest Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-700">Guest Name</div>
                <div className="text-gray-600">{booking.guestName}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-gray-600 truncate">{booking.guestEmail}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400" />
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-gray-600">{booking.guestPhone}</div>
                </div>
              </div>
            </div>

            {booking.specialRequests && (
              <>
                <Separator />
                <div className="text-sm">
                  <div className="font-medium text-gray-700 mb-1">Special Requests</div>
                  <div className="text-gray-600 bg-gray-50 p-2 rounded text-xs">
                    {booking.specialRequests}
                  </div>
                </div>
              </>
            )}

            {booking.cancellationReason && (
              <>
                <Separator />
                <div className="text-sm">
                  <div className="font-medium text-red-700 mb-1">Cancellation Reason</div>
                  <div className="text-red-600 bg-red-50 p-2 rounded text-xs">
                    {booking.cancellationReason}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex flex-wrap gap-2 justify-end">
              {/* View Details */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                    <Eye size={14} className="mr-1" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Booking Details</DialogTitle>
                    <DialogDescription>
                      Booking ID: {booking._id}
                    </DialogDescription>
                  </DialogHeader>
                  
                  {selectedBooking && (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Room Type:</strong> {selectedBooking.roomType}
                        </div>
                        <div>
                          <strong>Nights:</strong> {selectedBooking.numberOfNights}
                        </div>
                        <div>
                          <strong>Price/Night:</strong> ₹{selectedBooking.pricePerNight}
                        </div>
                        <div>
                          <strong>Subtotal:</strong> ₹{selectedBooking.totalAmount}
                        </div>
                        <div>
                          <strong>Tax Amount:</strong> ₹{selectedBooking.taxAmount}
                        </div>
                        <div>
                          <strong>Payment Method:</strong> {selectedBooking.paymentMethod}
                        </div>
                      </div>
                      
                      {selectedBooking.razorpayOrderId && (
                        <div className="text-xs text-gray-500">
                          <strong>Order ID:</strong> {selectedBooking.razorpayOrderId}
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        <strong>Booked on:</strong> {formatDate(selectedBooking.createdAt)}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Pay Now Button */}
              {booking.paymentStatus === "Pending" && booking.bookingStatus !== "Cancelled" && (
                <Button 
                  size="sm" 
                  onClick={() => handlePayment(booking._id)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={loading === booking._id}
                >
                  {loading === booking._id ? (
                    <Loader2 className="animate-spin h-4 w-4 mr-1" />
                  ) : (
                    <CreditCard size={14} className="mr-1" />
                  )}
                  Pay Now
                </Button>
              )}

              {/* Cancel Booking */}
              {canShowCancelButton(booking) && (
                canBeCancelled(booking) ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        disabled={loading === booking._id}
                      >
                        {loading === booking._id ? (
                          <Loader2 className="animate-spin h-4 w-4 mr-1" />
                        ) : (
                          <X size={14} className="mr-1" />
                        )}
                        Cancel
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel this booking? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cancellation-reason">Cancellation Reason *</Label>
                        <Textarea
                          id="cancellation-reason"
                          value={cancellationReason}
                          onChange={(e) => setCancellationReason(e.target.value)}
                          placeholder="Please provide a reason for cancellation..."
                          required
                        />
                      </div>
                      
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCancellationReason("")}>
                          Keep Booking
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleCancelBooking(booking._id)}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={!cancellationReason.trim()}
                        >
                          Cancel Booking
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleCancelClick(booking)}
                  >
                    <X size={14} className="mr-1" />
                    Cancel
                  </Button>
                )
              )}

              {/* Admin Actions */}
              {isAdmin && (
                <>
                  {booking.bookingStatus === "Pending" && (
                    <Button 
                      size="sm" 
                      onClick={() => updateBookingStatus(booking._id, "Confirmed")}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={loading === booking._id}
                    >
                      Confirm
                    </Button>
                  )}
                  
                  {booking.bookingStatus === "Confirmed" && (
                    <Button 
                      size="sm" 
                      onClick={() => updateBookingStatus(booking._id, "Completed")}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={loading === booking._id}
                    >
                      Complete
                    </Button>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookingList;