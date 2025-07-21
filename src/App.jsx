import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loading from "./shared/components/ui/Loading";
import { useAuth } from "./shared/hooks/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import MainLayout from "./shared/components/layout/MainLayout";
import AuthLayout from "./shared/components/layout/AuthLayout";
import GuestLayout from "./shared/components/layout/GuestLayout";
import UserDashboardLayout from "./shared/components/layout/UserLayout";

// Lazy load all page components
const Homepage = lazy(() => import("./pages/public/Homepage"));
const Login = lazy(() => import("./features/auth/pages/Login"));
const Register = lazy(() => import("./features/auth/pages/Register"));
const BookingPage = lazy(() => import("./features/booking/pages/BookingPage"));
const UserDashboard = lazy(() => import("./features/user/pages/UserDashboard"));
const AdminDashboard = lazy(() => import("./features/admin/pages/AdminDashboard"));
const ManageCourts = lazy(() => import("./features/admin/pages/ManageCourts"));
const ManageBookings = lazy(() => import("./features/admin/pages/ManageBookings"));
const ManageUsers = lazy(() => import("./features/admin/pages/ManageUsers"));
const About = lazy(() => import("./pages/public/About"));
const Courts = lazy(() => import("./features/courts/pages/Courts"));
const BookingHistory = lazy(() => import("./features/booking/pages/BookingHistory"));
const Contact = lazy(() => import("./pages/public/Contact"));
const GuestDashboard = lazy(() => import("./pages/public/GuestDashboard"));
const Forgot = lazy(() => import("./features/auth/pages/Forgot"));
const Messages = lazy(() => import("./features/admin/pages/MessagePage"));

function App() {
  const { loading, authReady, error, clearAuthState } = useAuth();

  // Show simple loading only during initial app startup (max 3 seconds)
  if (loading || !authReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loading text="Memuat P-Booking..." />
          
          {/* Show emergency options after 2 seconds */}
          <div className="mt-8 space-y-3">
            <p className="text-sm text-gray-600">
              Menyiapkan aplikasi booking futsal...
            </p>
            
            <button
              onClick={clearAuthState}
              className="px-6 py-2 bg-ballgreen text-white rounded-lg hover:bg-ballgreen/90 transition-colors text-sm font-medium"
            >
              🚀 Lewati - Lanjutkan ke Aplikasi
            </button>
            
            <p className="text-xs text-gray-400">
              Klik tombol di atas jika loading terlalu lama
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show auth error as a banner, but let app continue
  const AuthErrorBanner = () => {
    if (!error) return null;
    
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex items-center justify-between">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Auth Notice:</strong> {error}
              </p>
            </div>
          </div>
          <button
            onClick={() => clearAuthState()}
            className="text-yellow-400 hover:text-yellow-600"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // App is ready - render normally
  return (
    <div className="min-h-screen">
      <Suspense fallback={
  <GuestLayout>
    <Loading text="Memuat halaman..." />
  </GuestLayout>
}>
      <AuthErrorBanner />
      
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
              <Suspense fallback={<Loading text="Memuat halaman registrasi..." />}>
                <Register />
              </Suspense>
            }
          />
          <Route
            path="/forgot"
            element={
              <Suspense fallback={<Loading text="Memuat halaman lupa password..." />}>
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
              <Suspense fallback={<Loading text="Memuat halaman kelola booking..." />}>
                <ManageBookings />
              </Suspense>
            }
          />
          <Route
            path="/admin/courts"
            element={
              <Suspense fallback={<Loading text="Memuat halaman kelola lapangan..." />}>
                <ManageCourts />
              </Suspense>
            }
          />
          <Route
            path="/admin/users"
            element={
              <Suspense fallback={<Loading text="Memuat halaman kelola pengguna..." />}>
                <ManageUsers />
              </Suspense>
            }
          />
        </Route>

        {/* Redirect untuk route yang tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
      


</Suspense>
    </div>
  );
}

export default App;