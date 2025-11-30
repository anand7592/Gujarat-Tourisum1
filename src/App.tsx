import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout'; // Import Layout
import Users from './pages/users/Users';
import Place from './pages/place/Place';
import Ratings from './pages/Ratings/Ratings';
import SubPlaces from './pages/subPlace/SubPlace';
import Hotels from './pages/hotels/Hotel';

function App() {
  return (
    <>
 
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
          <Route path="/dashboard/package" element={<Dashboard />} />
          <Route path="/dashboard/hotel" element={<Hotels />} />
          <Route path="/dashboard/rating" element={<Ratings />} />
          {/* You can add more pages here later, e.g.: */}
          {/* <Route path="/profile" element={<Profile />} /> */}
          
        </Route>

      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes></>
  );
}

export default App;