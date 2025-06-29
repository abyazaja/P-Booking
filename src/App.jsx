import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loading from "./components/Loading";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import GuestLayout from "./layouts/GuestLayout";
import UserDashboardLayout from "./layouts/UserLayout";

// Lazy load all page components
const Homepage = lazy(() => import("./pages/Homepage"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ManageCourts = lazy(() => import("./pages/ManageCourts"));
const ManageBookings = lazy(() => import("./pages/ManageBookings"));
const ManageUsers = lazy(() => import("./pages/ManageUsers"));
const About = lazy(() => import("./pages/About"));
const Courts = lazy(() => import("./pages/Courts"));
const BookingHistory = lazy(() => import("./pages/BookingHistory"));
const Contact = lazy(() => import("./pages/Contact"));
const GuestDashboard = lazy(() => import("./pages/GuestDashboard"));
const Forgot = lazy(() => import("./pages/auth/Forgot"));
const Messages = lazy(() => import("./pages/MessagePage"));

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Loading text="Memuat data pengguna..." />;
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <Suspense fallback={<Loading text="Memuat halaman login..." />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense
              fallback={<Loading text="Memuat halaman registrasi..." />}
            >
              <Register />
            </Suspense>
          }
        />
        <Route
          path="/forgot"
          element={
            <Suspense
              fallback={<Loading text="Memuat halaman lupa password..." />}
            >
              <Forgot />
            </Suspense>
          }
        />
      </Route>

      <Route element={<GuestLayout />}>
        <Route
          path="/about"
          element={
            <Suspense fallback={<Loading text="Memuat halaman tentang..." />}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="/courts"
          element={
            <Suspense fallback={<Loading text="Memuat halaman lapangan..." />}>
              <Courts />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<Loading text="Memuat halaman kontak..." />}>
              <Contact />
            </Suspense>
          }
        />
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading text="Memuat dashboard..." />}>
              <GuestDashboard />
            </Suspense>
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <UserDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/booking"
          element={
            <Suspense fallback={<Loading text="Memuat halaman booking..." />}>
              <BookingPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<Loading text="Memuat dashboard..." />}>
              <UserDashboard />
            </Suspense>
          }
        />
        <Route
          path="/BookingHistory"
          element={
            <Suspense fallback={<Loading text="Memuat riwayat booking..." />}>
              <BookingHistory />
            </Suspense>
          }
        />
      </Route>

      {/* Admin routes */}
      <Route
        element={
          <AdminRoute>
            <MainLayout />
          </AdminRoute>
        }
      >
        <Route
          path="/admin/dashboard"
          element={
            <Suspense fallback={<Loading text="Memuat dashboard admin..." />}>
              <AdminDashboard />
            </Suspense>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <Suspense fallback={<Loading text="Memuat halaman pesan..." />}>
              <Messages />
            </Suspense>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <Suspense
              fallback={<Loading text="Memuat halaman kelola booking..." />}
            >
              <ManageBookings />
            </Suspense>
          }
        />
        <Route
          path="/admin/courts"
          element={
            <Suspense
              fallback={<Loading text="Memuat halaman kelola lapangan..." />}
            >
              <ManageCourts />
            </Suspense>
          }
        />
        <Route
          path="/admin/users"
          element={
            <Suspense
              fallback={<Loading text="Memuat halaman kelola pengguna..." />}
            >
              <ManageUsers />
            </Suspense>
          }
        />
      </Route>

      {/* Redirect untuk route yang tidak ditemukan */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
