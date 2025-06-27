import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BookingPage from './pages/BookingPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManageCourts from './pages/ManageCourts';
import ManageBookings from './pages/ManageBookings';
import ManageUsers from './pages/ManageUsers';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import About from './pages/About';
import Courts from './pages/Courts';
import Contact from './pages/Contact';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import GuestLayout from './layouts/GuestLayout';
import GuestDashboard from './pages/GuestDashboard';
import Forgot from './pages/auth/Forgot';

// Import CSS untuk booking


function App() {
  return (
    <Routes>
      

      <Route element={<MainLayout />}>
        {/* Protected routes yang memerlukan login */}
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
      </Route>

      <Route element={<GuestLayout />}>
        <Route path="/" element={<GuestDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/courts" element={<Courts />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/GuestDashboard" element={<GuestDashboard />} />
      </Route>
 
      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/courts" element={<AdminRoute><ManageCourts /></AdminRoute>} />
      <Route path="/a
      
      " element={<AdminRoute><ManageBookings /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />

      {/* Redirect untuk route yang tidak ditemukan */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
