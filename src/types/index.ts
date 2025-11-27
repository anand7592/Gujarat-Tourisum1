export interface User{
    _id:string;
    firstName:string;
    lastName:string;
    email:string;
    isAdmin:boolean;
}

export interface AuthResponse{
    message:string;
    token:string;
    user:User;
}