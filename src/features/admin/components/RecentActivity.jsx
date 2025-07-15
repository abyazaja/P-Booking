// src/components/RecentActivity.jsx
import React, { useState, useEffect } from 'react';
import { Clock, Loader2, User } from 'lucide-react'; // Impor ikon yang diperlukan
import { bookingAPI } from '../../../shared/services/bookingAPI'; // Impor bookingAPI Anda
import { BOOKING_STATUS } from '../../../shared/constants/supabase'; // Impor status booking Anda
import toast from 'react-hot-toast'; // Untuk notifikasi kesalahan

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fungsi ini akan dijalankan saat komponen pertama kali dimuat
    fetchRecentBookings();
  }, []); // Array dependensi kosong berarti hanya berjalan sekali (mirip componentDidMount)

  const fetchRecentBookings = async () => {
    try {
      setLoading(true); // Mulai loading
      setError(null); // Reset pesan error sebelumnya

      // Mengambil semua booking dari bookingAPI Anda
      // Pastikan bookingAPI.getAllBookings() mengembalikan { data, error }
      const { data, error: apiError } = await bookingAPI.getAllBookings();

      if (apiError) {
        // Jika ada error dari API, lemparkan error tersebut
        throw apiError;
      }

      // Memproses data yang diterima:
      // 1. Pastikan data tidak null atau undefined
      // 2. Urutkan data berdasarkan 'created_at' dari yang terbaru ke terlama
      // 3. Ambil hanya 5 aktivitas terbaru (Anda bisa menyesuaikan angka ini)
      // 4. Petakan setiap booking menjadi objek 'activity' dengan format yang Anda inginkan
      const recentBookings = (data || [])
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Urutkan dari terbaru
        .slice(0, 5) // Ambil 5 terbaru
        .map(booking => {
          let actionText = '';
          let type = ''; // Digunakan untuk menentukan warna badge

          // Tentukan teks aksi dan jenis berdasarkan status booking
          switch (booking.status) {
            case BOOKING_STATUS.APPROVED:
              actionText = `menyetujui booking untuk ${booking.courts?.name || 'sebuah lapangan'}`;
              type = 'approved';
              break;
            case BOOKING_STATUS.PENDING:
              actionText = `membuat booking untuk ${booking.courts?.name || 'sebuah lapangan'} (menunggu persetujuan)`;
              type = 'pending';
              break;
            case BOOKING_STATUS.REJECTED:
              actionText = `menolak booking untuk ${booking.courts?.name || 'sebuah lapangan'}`;
              type = 'rejected';
              break;
            case BOOKING_STATUS.CANCELLED:
              actionText = `membatalkan booking untuk ${booking.courts?.name || 'sebuah lapangan'}`;
              type = 'cancelled';
              break;
            default:
              actionText = `melakukan aksi pada booking untuk ${booking.courts?.name || 'sebuah lapangan'}`;
              type = 'info'; // Status default atau tidak dikenal
          }

          return {
            id: booking.id, // Gunakan ID unik dari booking untuk key React
            user: booking.users?.name || 'Pengguna Tidak Dikenal', // Ambil nama pengguna dari relasi
            action: actionText,
            time: formatTimeAgo(booking.created_at), // Format waktu
            type: type,
            // Buat inisial avatar dari nama pengguna
            avatarInitials: (booking.users?.name || '??').split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2)
          };
        });

      setActivities(recentBookings); // Update state dengan data yang sudah diproses

    } catch (err) {
      console.error('Error fetching recent bookings:', err);
      setError('Gagal memuat aktivitas terbaru.'); // Set pesan error
      toast.error('Gagal memuat aktivitas terbaru.'); // Tampilkan toast notifikasi
    } finally {
      setLoading(false); // Selesai loading, tidak peduli berhasil atau gagal
    }
  };

  // Fungsi helper untuk mengubah timestamp menjadi format "X waktu lalu"
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds} detik lalu`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} hari lalu`;
    // Fallback ke format tanggal spesifik jika sudah terlalu lama
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Fungsi helper untuk menentukan warna badge berdasarkan jenis aktivitas
  const getActivityColor = (type) => {
    switch (type) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'info': return 'bg-blue-100 text-blue-800'; // Default / info
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-green-600" />
        Aktivitas Terbaru
      </h3>
      {loading ? (
        // Tampilkan spinner loading jika data sedang dimuat
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-green-500" />
          <span className="text-gray-600 ml-3">Memuat aktivitas...</span>
        </div>
      ) : error ? (
        // Tampilkan pesan error jika terjadi kesalahan
        <div className="text-center py-6 text-red-500">
          <p>{error}</p>
          <button onClick={fetchRecentBookings} className="mt-2 text-blue-600 hover:underline">Coba lagi</button>
        </div>
      ) : activities.length === 0 ? (
        // Tampilkan pesan jika tidak ada aktivitas
        <div className="text-center py-6 text-gray-500">
          <p>Belum ada aktivitas booking terbaru.</p>
        </div>
      ) : (
        // Tampilkan daftar aktivitas jika data tersedia
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              {/* Avatar Pengguna */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
                {activity.avatarInitials}
              </div>
              {/* Detail Aktivitas */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              {/* Badge Status */}
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActivityColor(activity.type)}`}>
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} {/* Ubah huruf pertama jadi kapital */}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;