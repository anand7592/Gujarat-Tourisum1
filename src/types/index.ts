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

export interface AuthResponse{
    message:string;
    token:string;
    user:User;
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