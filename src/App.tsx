import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import './lib/debugAuth';
import './lib/testRazorpay';

// Lazy load all pages for better code splitting
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Users = lazy(() => import('./pages/users/Users'));
const Place = lazy(() => import('./pages/place/Place'));
const Ratings = lazy(() => import('./pages/Ratings/Ratings'));
const SubPlaces = lazy(() => import('./pages/subPlace/SubPlace'));
const Hotels = lazy(() => import('./pages/hotels/Hotel'));
const Bookings = lazy(() => import('./pages/bookings/Bookings'));
const Payment = lazy(() => import('./pages/bookings/Payment'));
const Package = lazy(() => import('./pages/packages/Package'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* SECURITY LAYER: ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          
          {/* LAYOUT LAYER: DashboardLayout */}
          <Route element={<DashboardLayout />}>
            
            {/* CONTENT LAYER: The actual pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/user" element={<Users />} />
            <Route path="/dashboard/place" element={<Place />} />
            <Route path="/dashboard/subplace" element={<SubPlaces />} />
            <Route path="/dashboard/package" element={<Package />} />
            <Route path="/dashboard/hotel" element={<Hotels />} />
            <Route path="/dashboard/rating" element={<Ratings />} />
            <Route path="/dashboard/bookings" element={<Bookings />} />
            <Route path="/dashboard/booking/:bookingId/payment" element={<Payment />} />
            
          </Route>

        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;