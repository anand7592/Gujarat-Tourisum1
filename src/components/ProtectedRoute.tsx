import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from "lucide-react"; // Optional loading icon

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Wait for Server Verification
  // While we check with the backend, show a loading spinner
  // instead of letting the user see the "Admin" UI for a split second.
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // 2. If verified, show content. If not, kick them out.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;