import type { ReactNode } from "react";
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  address: string;
  isAdmin: boolean;
  role?: 'admin' | 'user'; // Optional role property
  createdAt?: string; // Optional: good for display
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Place {
  createdBy: ReactNode;
  _id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  image?: string;
}

export interface SubPlace {
  _id: string;
  name: string;
  description: string;
  place: Place;
  location: string;
  image?: string;
  entryFee: number;
  openTime: string;
  closeTime: string;
  bestTimeToVisit: string;
  features: string[];
  createdAt?: string;
}

export interface RoomType {
  name: string; // e.g. "Deluxe"
  pricePerNight: number;
  maxGuests: number;
  bedType?: string;
  amenities?: string[]; // ["TV", "AC"]
}

export interface Hotel {
  _id: string;
  name: string;
  description: string;
  place: Place; // Populated
  location: string;
  address: string;
  contactNo: string;
  email?: string;
  website?: string;
  images: string[];
  pricePerNight: number;
  category: "Budget" | "Mid-Range" | "Luxury" | "Resort" | "Boutique";
  amenities: string[];
  roomTypes: RoomType[];
  averageRating: number;
  isActive: boolean;
  createdBy: User;
  createdAt?: string;
}

export interface Rating {
  _id: string;
  user: User;
  ratingType: "Hotel" | "Place" | "SubPlace";
  hotel?: Hotel;
  place?: Place;
  subPlace?: SubPlace;
  rating: number; // 1-5
  title: string;
  comment: string;
  cleanliness?: number;
  service?: number;
  location?: number;
  valueForMoney?: number;
  images: string[];
  helpfulCount: number;
  adminResponse?: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  user: User;
  hotel: Hotel;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  roomType: string;
  numberOfRooms: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  numberOfGuests: number;
  specialRequests?: string;
  pricePerNight: number;
  totalAmount: number;
  taxAmount: number;
  finalAmount: number;
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  bookingStatus: "Confirmed" | "Pending" | "Cancelled" | "Completed";
  cancellationReason?: string;
  cancelledAt?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormData {
  hotel: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  numberOfRooms: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  numberOfGuests: number;
  specialRequests?: string;
  pricePerNight: number;
  paymentMethod: string;
}

export interface Package {
  _id: string;
  name: string;
  description: string;
  duration: number; // in days
  price: number;
  discountedPrice?: number;
  category: "Adventure" | "Cultural" | "Religious" | "Wildlife" | "Beach" | "Hill Station" | "Heritage" | "Family" | "Romantic" | "Budget";
  difficulty: "Easy" | "Moderate" | "Hard";
  groupSize: {
    min: number;
    max: number;
  };
  included: string[]; // What's included in the package
  excluded: string[]; // What's not included
  itinerary: PackageItinerary[];
  images: string[];
  places: Place[]; // Places covered in the package
  hotels: Hotel[]; // Recommended/included hotels
  startDate: string;
  endDate: string;
  availableSlots: number;
  bookedSlots: number;
  isActive: boolean;
  highlights: string[]; // Key attractions/features
  meetingPoint: string;
  cancellationPolicy: string;
  termsAndConditions: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface PackageItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: ("Breakfast" | "Lunch" | "Dinner")[];
  accommodation?: string;
  places: string[]; // Place names to visit on this day
}

export interface PackageBooking {
  _id: string;
  user: User;
  package: Package;
  numberOfPeople: number;
  bookingDate: string;
  totalAmount: number;
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  bookingStatus: "Confirmed" | "Pending" | "Cancelled" | "Completed";
  specialRequests?: string;
  contactDetails: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PackageFormData {
  name: string;
  description: string;
  duration: number;
  price: number;
  discountedPrice: string;
  category: string;
  difficulty: string;
  groupSizeMin: number;
  groupSizeMax: number;
  included: string;
  excluded: string;
  highlights: string;
  meetingPoint: string;
  cancellationPolicy: string;
  termsAndConditions: string;
  startDate: string;
  endDate: string;
  availableSlots: number;
  places: string[];
  hotels: string[];
}
