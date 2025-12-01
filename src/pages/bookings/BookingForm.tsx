import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Hotel, BookingFormData } from "@/types";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateInputDD_MM_YYYY } from "@/components/ui/date-input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Users, Phone, Mail, CreditCard, MapPin, Building2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingFormProps {
  hotelId?: string;
  onSuccess?: () => void;
}

interface BookingFormProps {
  hotelId?: string;
}

const BookingForm = ({ hotelId, onSuccess }: BookingFormProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const selectedHotelId = hotelId || id;
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<BookingFormData>({
    hotel: selectedHotelId || "",
    checkInDate: "",
    checkOutDate: "",
    roomType: "",
    numberOfRooms: 1,
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    numberOfGuests: 1,
    specialRequests: "",
    pricePerNight: 0,
    paymentMethod: "Razorpay",
  });

  const [bookingSummary, setBookingSummary] = useState({
    numberOfNights: 0,
    totalAmount: 0,
    taxAmount: 0,
    finalAmount: 0,
  });

  // Define functions first before useEffect hooks
  const fetchHotels = useCallback(async () => {
    try {
      const response = await api.get('/hotels');
      setHotels(response.data || []);
    } catch (error: unknown) {
      console.error('Failed to fetch hotels:', error);
      setError('Failed to load hotels. Please try again.');
    }
  }, []);

  const fetchHotelDetails = useCallback(async () => {
    if (!selectedHotelId) return;
    
    try {
      setLoading(true);
      const { data } = await api.get(`/hotels/${selectedHotelId}`);
      setHotel(data);
      setFormData(prev => ({
        ...prev,
        hotel: data._id,
        pricePerNight: data.pricePerNight || 0,
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load hotel details";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedHotelId]);

  const calculateBookingSummary = useCallback(() => {
    if (formData.checkInDate && formData.checkOutDate && formData.pricePerNight) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      
      if (checkOut > checkIn) {
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const totalAmount = formData.pricePerNight * numberOfNights * formData.numberOfRooms;
        const taxAmount = totalAmount * 0.18; // 18% GST
        const finalAmount = totalAmount + taxAmount;

        setBookingSummary({
          numberOfNights,
          totalAmount,
          taxAmount,
          finalAmount,
        });
      }
    }
  }, [formData.checkInDate, formData.checkOutDate, formData.pricePerNight, formData.numberOfRooms]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  useEffect(() => {
    if (selectedHotelId) {
      fetchHotelDetails();
    } else {
      setLoading(false); // Stop loading if no specific hotel ID
    }
  }, [selectedHotelId, fetchHotelDetails]);

  useEffect(() => {
    calculateBookingSummary();
  }, [calculateBookingSummary]);

  const handleHotelSelect = (hotelId: string) => {
    const selectedHotel = hotels.find(h => h._id === hotelId);
    if (selectedHotel) {
      setHotel(selectedHotel);
      setFormData(prev => ({
        ...prev,
        hotel: hotelId,
        roomType: '',
        pricePerNight: 0
      }));
    }
  };

  const handleRoomTypeSelect = (roomType: string) => {
    const selectedRoom = hotel?.roomTypes?.find(room => room.name === roomType);
    if (selectedRoom) {
      setFormData(prev => ({
        ...prev,
        roomType,
        pricePerNight: selectedRoom.pricePerNight,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.checkInDate || !formData.checkOutDate || !formData.roomType || 
        !formData.guestName || !formData.guestEmail || !formData.guestPhone) {
      setError("Please fill all required fields");
      return;
    }

    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    
    if (checkIn < new Date()) {
      setError("Check-in date must be in the future");
      return;
    }
    
    if (checkOut <= checkIn) {
      setError("Check-out date must be after check-in date");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const bookingData = {
        ...formData,
        pricePerNight: formData.pricePerNight,
      };

      const { data } = await api.post("/bookings", bookingData);
      
      // Call onSuccess callback or navigate to payment
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/dashboard/booking/${data.booking._id}/payment`);
      }
      
    } catch (error: unknown) {
      console.error("Failed to create booking:", error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        
        if (axiosError.response?.status === 404) {
          setError("Booking API endpoints not implemented yet. Please implement the backend booking system first.");
        } else {
          setError(axiosError.response?.data?.message || "Failed to create booking");
        }
      } else {
        setError("Failed to create booking: Network error or API not available");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (!selectedHotelId && hotels.length > 0 && !hotel) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Select Hotel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="hotel-select">Choose a hotel to book:</Label>
              <Select onValueChange={handleHotelSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a hotel" />
                </SelectTrigger>
                <SelectContent>
                  {hotels.map((hotelOption) => (
                    <SelectItem key={hotelOption._id} value={hotelOption._id}>
                      <div className="flex items-center gap-3">
                        <img 
                          src={hotelOption.images?.[0] || "/placeholder.jpg"} 
                          alt={hotelOption.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium">{hotelOption.name}</div>
                          <div className="text-xs text-gray-500">{hotelOption.location}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error || "Hotel not found"}</p>
        <Button onClick={() => navigate('/dashboard/hotel')} className="mt-4">
          Browse Hotels
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Hotel Information */}
      <Card className="border-t-4 border-t-blue-600">
        <CardHeader className="bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <img 
              src={hotel.images[0] || "/placeholder.jpg"} 
              alt={hotel.name}
              className="w-full md:w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <CardTitle className="text-xl text-gray-800">{hotel.name}</CardTitle>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin size={16} className="mr-1" />
                {hotel.location}
              </div>
              <Badge className="mt-2 bg-blue-100 text-blue-700">
                {hotel.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <Card className="border-t-4 border-t-green-600">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Calendar size={20} />
                Book Your Stay
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Check-in Date * (DD/MM/YYYY)</Label>
                    <DateInputDD_MM_YYYY
                      value={formData.checkInDate}
                      onChange={(date) => setFormData({...formData, checkInDate: date})}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="date-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Check-out Date * (DD/MM/YYYY)</Label>
                    <DateInputDD_MM_YYYY
                      value={formData.checkOutDate}
                      onChange={(date) => setFormData({...formData, checkOutDate: date})}
                      min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                      required
                      className="date-input"
                    />
                  </div>
                </div>

                {/* Room Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Room Type *</Label>
                    <Select
                      value={formData.roomType}
                      onValueChange={handleRoomTypeSelect}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Room Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {hotel.roomTypes.map((room) => (
                          <SelectItem key={room.name} value={room.name}>
                            {room.name} - ₹{room.pricePerNight}/night
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Rooms *</Label>
                    <Input
                      type="number"
                      value={formData.numberOfRooms}
                      onChange={(e) => setFormData({...formData, numberOfRooms: parseInt(e.target.value)})}
                      min="1"
                      max="10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Number of Guests *</Label>
                  <Input
                    type="number"
                    value={formData.numberOfGuests}
                    onChange={(e) => setFormData({...formData, numberOfGuests: parseInt(e.target.value)})}
                    min="1"
                    max="20"
                    required
                  />
                </div>

                <Separator />

                {/* Guest Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users size={18} />
                    Guest Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label>Guest Name *</Label>
                    <Input
                      value={formData.guestName}
                      onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                      placeholder="Full name as per ID"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Mail size={14} />
                        Email Address *
                      </Label>
                      <Input
                        type="email"
                        value={formData.guestEmail}
                        onChange={(e) => setFormData({...formData, guestEmail: e.target.value})}
                        placeholder="guest@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Phone size={14} />
                        Phone Number *
                      </Label>
                      <Input
                        type="tel"
                        value={formData.guestPhone}
                        onChange={(e) => setFormData({...formData, guestPhone: e.target.value})}
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Special Requests (Optional)</Label>
                    <Textarea
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                      placeholder="Any special requirements or requests..."
                      maxLength={500}
                    />
                  </div>
                </div>

                <Separator />

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard size={18} />
                    Payment Method
                  </h3>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Razorpay">Online Payment (Razorpay)</SelectItem>
                      <SelectItem value="Pay at Hotel">Pay at Hotel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  disabled={submitting} 
                  className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Booking...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-t-4 border-t-orange-600">
            <CardHeader className="bg-orange-50 border-b">
              <CardTitle className="text-lg text-orange-800">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {bookingSummary.numberOfNights > 0 && (
                <>
                  <div className="flex justify-between">
                    <span>Room Rate</span>
                    <span>₹{formData.pricePerNight}/night</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Nights</span>
                    <span>{bookingSummary.numberOfNights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Rooms</span>
                    <span>{formData.numberOfRooms}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{bookingSummary.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Taxes & Fees (18%)</span>
                    <span>₹{bookingSummary.taxAmount.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span className="text-green-600">₹{bookingSummary.finalAmount.toLocaleString()}</span>
                  </div>
                </>
              )}
              
              {bookingSummary.numberOfNights === 0 && (
                <p className="text-gray-500 text-sm">
                  Select check-in and check-out dates to see pricing
                </p>
              )}

              <div className="text-xs text-gray-500 mt-4">
                <p>• Free cancellation up to 24 hours before check-in</p>
                <p>• Prices are inclusive of all taxes</p>
                <p>• Breakfast may be included based on room type</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;