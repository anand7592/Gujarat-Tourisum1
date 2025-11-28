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