import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BookingPage from './pages/BookingPage';
import UserDashboard from './pages/UserDashboard';
import AdminLogin from './pages/AdminLogin';
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
function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />}/>
        <Route element={<MainLayout/>}>
          
        </Route>
        <Route element={<AuthLayout/>}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>
        <Route element={<GuestLayout/>}>
          <Route path="/about" element={<About />} />
          <Route path="/courts" element={<Courts />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/GuestDashboard" element={<GuestDashboard/>}></Route>
        </Route>
      
      
      
      <Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/courts" element={<AdminRoute><ManageCourts /></AdminRoute>} />
      <Route path="/admin/bookings" element={<AdminRoute><ManageBookings /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />

    </Routes>
  );
}

export default App;
