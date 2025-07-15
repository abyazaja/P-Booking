import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function DateSelector({ selectedField, onDateSelect, onBack }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-6 md:p-10 text-center relative overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold text-ballblack mb-4">
        Pilih Tanggal
      </h2>

      {/* Info Lapangan */}
      <div className="bg-ballgreen/10 rounded-2xl p-4 mb-6 text-left">
        <h3 className="text-xl font-semibold text-ballgreen mb-1">
          {selectedField?.name}
        </h3>
        <p className="text-ballblack/80 mb-2">
          {selectedField?.description}
        </p>
        <p className="font-medium text-sm text-ballblack">
          Harga: <span className="text-ballorange">{formatPrice(selectedField?.price)}</span>/jam
        </p>
      </div>

      {/* Date Picker */}
      <div className="flex justify-center mb-6">
        <DatePicker
          selected={null}
          onChange={onDateSelect}
          minDate={new Date()}
          maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
          inline
          locale="id"
          calendarClassName="bg-white rounded-2xl shadow-lg border border-gray-200rounded-2xl shadow-md"
        />
      </div>

      {/* Tombol Aksi */}
      <div className="flex justify-center mt-4">
        <button
          className="px-6 py-2 rounded-full bg-ballblack text-white font-semibold hover:bg-ballblack/90 transition"
          onClick={onBack}
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
