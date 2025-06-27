import React from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Calendar,
  CreditCard,
} from "lucide-react";

const bookings = [
  {
    id: 1,
    courtType: "Lapangan Futsal Vinyl",
    date: "15 Juni 2023",
    time: "19:00 - 21:00",
    duration: "2 jam",
    price: "Rp 300.000",
    paymentProof: "/proof1.jpg",
    status: "accept",
    paymentMethod: "Transfer Bank",
  },
  {
    id: 2,
    courtType: "Lapangan Futsal Rumput Sintetis",
    date: "18 Juni 2023",
    time: "16:00 - 18:00",
    duration: "2 jam",
    price: "Rp 350.000",
    paymentProof: "/proof2.jpg",
    status: "pending",
    paymentMethod: "E-Wallet",
  },
  {
    id: 3,
    courtType: "Lapangan Futsal Vinyl",
    date: "20 Juni 2023",
    time: "20:00 - 22:00",
    duration: "2 jam",
    price: "Rp 300.000",
    paymentProof: "/proof3.jpg",
    status: "decline",
    paymentMethod: "Transfer Bank",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "accept":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "decline":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const BookingHistory = () => {
  const viewPaymentProof = (proofUrl) => {
    window.open(proofUrl, "_blank");
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="rounded-2xl border bg-white p-6 shadow space-y-6">
        {/* Judul */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Riwayat Booking</h2>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Lapangan
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal & Jam
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durasi
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metode Pembayaran
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.courtType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {booking.date}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {booking.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      {booking.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status === "accept" && "Diterima"}
                      {booking.status === "pending" && "Menunggu"}
                      {booking.status === "decline" && "Ditolak"}
                    </span>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;
