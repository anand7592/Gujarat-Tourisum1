import type { ReactNode } from "react";
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  address: string;
  isAdmin: boolean;
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
