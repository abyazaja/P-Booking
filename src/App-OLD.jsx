import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
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
  const { loading, profileError, user, isProfileFetching, clearStuckState, forceAppReady } = useAuth();
  
  // Debug helper - can be removed in production
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Press Ctrl+Shift+D to show debug info
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        console.log('[Auth Debug] Current state:', {
          loading,
          profileError,
          user: user ? { id: user.id, email: user.email, role: user.role } : null,
          isProfileFetching
        });
        
        if (loading && !isProfileFetching) {
          console.log('[Auth Debug] Detected stuck loading state');
          if (confirm('Auth seems stuck in loading state. Clear it?')) {
            clearStuckState();
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [loading, profileError, user, isProfileFetching, clearStuckState]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loading text="Memuat aplikasi..." />
        <div className="mt-6 text-center text-sm text-gray-500 max-w-md">
          <p className="mb-4">Sedang menginisialisasi aplikasi. Jika proses ini terlalu lama:</p>
          <div className="space-y-2">
            <button 
              onClick={() => {
                console.log('[Debug] Manual loading clear requested');
                clearStuckState();
              }}
              className="block w-full px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 rounded transition-colors"
            >
              🔄 Clear Loading State
            </button>
            <button 
              onClick={() => {
                console.log('[Debug] Force app ready requested');
                forceAppReady();
              }}
              className="block w-full px-4 py-2 text-sm bg-green-100 hover:bg-green-200 rounded transition-colors"
            >
              🚀 Force App to Load
            </button>
            <p className="text-xs text-gray-400 mt-2">
              Debug: Ctrl+Shift+D | Refresh halaman jika masih bermasalah
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (profileError) {
    const isDatabaseError = profileError.toLowerCase().includes('database') || 
                           profileError.toLowerCase().includes('permission') ||
                           profileError.toLowerCase().includes('rls');
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {isDatabaseError ? "📊 Database Belum Siap" : "⚠️ Gagal Memuat Aplikasi"}
          </h2>
          
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700 font-medium mb-2">Detail Error:</p>
            <p className="text-sm text-gray-600">{profileError}</p>
          </div>
          
          {isDatabaseError && (
            <div className="text-left bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-800 mb-2">🔧 Cara Mengatasi:</h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Buka Supabase SQL Editor</li>
                <li>Jalankan script <code className="bg-blue-100 px-1 rounded">database-setup.sql</code></li>
                <li>Buat admin user dengan: <code className="bg-blue-100 px-1 rounded">SELECT public.make_user_admin('email@anda.com')</code></li>
                <li>Refresh halaman ini</li>
              </ol>
            </div>
          )}
          
          <div className="space-y-3">
            <button 
              className="w-full px-4 py-2 bg-ballgreen text-white rounded-lg hover:bg-green-600 transition-colors"
              onClick={() => window.location.reload()}
            >
              🔄 Coba Lagi
            </button>
            
            <button 
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              onClick={() => forceAppReady()}
            >
              🚀 Lanjutkan Tanpa Database (Mode Terbatas)
            </button>
            
            <p className="text-xs text-gray-400">
              Jika masalah berlanjut, hubungi admin atau periksa koneksi internet
            </p>
          </div>
        </div>
      </div>
    );
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
