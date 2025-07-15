import React, { useState } from 'react';
import { Check, CreditCard, Wallet, Upload, Loader2 } from 'lucide-react';

export default function BookingConfirmation({
  selectedField,
  selectedDate,
  selectedTime,
  onBack,
  onReset,
  onSubmit,
  submitting = false
}) {
  const [notes, setNotes] = useState('');

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price || 50000);
  };

  const startTime = selectedTime?.start || '10:00';
  const endTime = selectedTime?.end || '12:00';
  const duration = 2; // Default 2 hours
  const totalPrice = 50000 * duration;

  const handleSubmit = async () => {
    if (!onSubmit) return;
    
    const bookingData = {
      notes: notes.trim()
    };

    await onSubmit(bookingData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-10 border">
      {/* Header */}
      <div className="text-center mb-6">
        <Check size={48} className="mx-auto text-green-600 mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Konfirmasi Booking</h2>
      </div>

      {/* Booking Detail */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detail Booking</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Lapangan:</span>
            <strong className="text-gray-800">{selectedField?.name}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Lokasi:</span>
            <strong className="text-gray-800">{selectedField?.location}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tanggal:</span>
            <strong className="text-gray-800">{formatDate(selectedDate)}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Jam:</span>
            <strong className="text-gray-800">{startTime} - {endTime}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Durasi:</span>
            <strong className="text-gray-800">{duration} Jam</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Kapasitas:</span>
            <strong className="text-gray-800">{selectedField?.capacity} orang</strong>
          </div>
          <hr className="border-gray-300" />
          <div className="flex justify-between text-lg">
            <span className="font-semibold text-gray-800">Total Harga:</span>
            <strong className="text-green-600">{formatPrice(totalPrice)}</strong>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Catatan (Opsional)</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tambahkan catatan khusus untuk booking ini..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Check className="w-5 h-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Informasi Booking
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>• Booking akan dikirim ke admin untuk persetujuan</p>
              <p>• Anda akan menerima notifikasi setelah admin menyetujui/menolak</p>
              <p>• Pembayaran dilakukan setelah booking disetujui</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Kembali
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Konfirmasi Booking
            </>
          )}
        </button>
      </div>
    </div>
  );
}
