import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout'; // Import Layout

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* SECURITY LAYER: ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        
        {/* LAYOUT LAYER: DashboardLayout */}
        <Route element={<DashboardLayout />}>
          
          {/* CONTENT LAYER: The actual pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* You can add more pages here later, e.g.: */}
          {/* <Route path="/profile" element={<Profile />} /> */}
          
        </Route>

      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;