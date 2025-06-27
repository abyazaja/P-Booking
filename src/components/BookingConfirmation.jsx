import React, { useState } from 'react';
import { Check, CreditCard, Wallet, Upload } from 'lucide-react';

export default function BookingConfirmation({
  selectedField,
  selectedDate,
  selectedTime,
  onBack,
  onReset
}) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  };

  const { startTime, duration } = selectedTime;
  const endHour = parseInt(startTime.split(':')[0], 10) + duration;
  const endTime = `${String(endHour).padStart(2, '0')}:00`;
  const totalPrice = selectedField.pricePerHour * duration;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setProofFile(file);
  };

  const handleConfirmBooking = async () => {
    if (!paymentMethod) return alert('Silakan pilih metode pembayaran');
    if (paymentMethod === 'transfer' && !paymentType)
      return alert('Silakan pilih jenis pembayaran (DP / Full)');
    if (paymentMethod === 'transfer' && !proofFile)
      return alert('Silakan unggah bukti pembayaran');

    setIsProcessing(true);

    try {
      const bookingData = {
        fieldId: selectedField.id,
        fieldName: selectedField.name,
        date: selectedDate,
        startTime,
        endTime,
        duration,
        pricePerHour: selectedField.pricePerHour,
        totalPrice,
        paymentMethod,
        paymentType,
        status: 'pending',
        proofFile,
      };

      console.log('Booking data:', bookingData);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert('Booking berhasil! Silakan tunggu konfirmasi admin.');
      onReset();
    } catch (error) {
      console.error('Booking error:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
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
          <hr className="border-gray-300" />
          <div className="flex justify-between text-lg">
            <span className="font-semibold text-gray-800">Total Harga:</span>
            <strong className="text-green-600">{formatPrice(totalPrice)}</strong>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Jenis Pembayaran</h3>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col items-center gap-2 transition ${
              paymentType === 'dp' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPaymentType('dp')}
          >
            <span className={`font-medium ${paymentType === 'dp' ? 'text-green-600' : 'text-gray-700'}`}>
              DP
            </span>
            <input
              type="radio"
              name="paymentType"
              value="dp"
              checked={paymentType === 'dp'}
              onChange={() => setPaymentType('dp')}
              className="hidden"
            />
          </div>

          <div
            className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col items-center gap-2 transition ${
              paymentType === 'full' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPaymentType('full')}
          >
            <span className={`font-medium ${paymentType === 'full' ? 'text-green-600' : 'text-gray-700'}`}>
              Full
            </span>
            <input
              type="radio"
              name="paymentType"
              value="full"
              checked={paymentType === 'full'}
              onChange={() => setPaymentType('full')}
              className="hidden"
            />
          </div>
        </div>
      </div>


      {/* Jika transfer, tampilkan pilihan DP/full + upload */}
      
        <div className="mb-6 space-y-4">
          {/* Upload Bukti Pembayaran */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Upload Bukti Pembayaran</h3>
            <label
              htmlFor="upload-proof"
              className={`flex items-center justify-center px-4 py-3 border-2 rounded-xl cursor-pointer transition ${
                proofFile ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300 hover:border-gray-400'
              }`}
            >
              <Upload className="w-5 h-5 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {proofFile ? 'Bukti sudah dipilih' : 'Klik untuk upload gambar'}
              </span>
              <input
                id="upload-proof"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {proofFile && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <img
                  src={URL.createObjectURL(proofFile)}
                  alt="Preview Bukti"
                  className="w-full max-w-sm rounded-xl shadow border"
                />
              </div>
            )}
          </div>
        </div>
    

      {/* Tombol Aksi */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          className="px-6 py-3 rounded-full bg-gray-600 text-white font-semibold hover:bg-gray-700 transition disabled:opacity-50"
          onClick={onBack}
          disabled={isProcessing}
        >
          Kembali
        </button>
        <button
          className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
          onClick={handleConfirmBooking}
          disabled={isProcessing}
        >
          {isProcessing ? 'Memproses...' : 'Konfirmasi Booking'}
        </button>
      </div>
    </div>
  );
}
