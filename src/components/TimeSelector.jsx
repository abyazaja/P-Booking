import React, { useState, useEffect } from 'react';

export default function TimeSelector({ selectedField, selectedDate, onTimeSelect, onBack }) {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);

  const allTimes = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  useEffect(() => {
    const fetchBookedTimes = async () => {
      const mockBookedTimes = ['10:00', '14:00', '19:00'];
      setBookedTimes(mockBookedTimes);

      const available = allTimes.filter(time => !mockBookedTimes.includes(time));
      setAvailableTimes(available);
    };

    fetchBookedTimes();
  }, [selectedField, selectedDate]);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-6 md:p-10 text-center relative overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold text-ballblack mb-4">Pilih Jam</h2>

      {/* Ringkasan Pilihan */}
      <div className="bg-ballgreen/10 rounded-2xl p-4 mb-6 text-left space-y-2">
        <p className="text-ballblack">
          <span className="font-semibold text-ballgreen">Lapangan: </span>{selectedField?.name}
        </p>
        <p className="text-ballblack">
          <span className="font-semibold text-ballgreen">Tanggal: </span>{formatDate(selectedDate)}
        </p>
        <p className="text-ballblack">
          <span className="font-semibold text-ballgreen">Harga: </span>
          <span className="text-ballorange">{formatPrice(selectedField?.pricePerHour)}</span>/jam
        </p>
      </div>

      {/* Pilihan Jam */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {allTimes.map((time) => {
          const isBooked = bookedTimes.includes(time);
          const endTime = String(parseInt(time.split(':')[0]) + 1).padStart(2, '0') + ':00';

          return (
            <button
              key={time}
              onClick={() => !isBooked && onTimeSelect(time)}
              disabled={isBooked}
              className={`
                px-4 py-3 rounded-xl text-sm font-medium transition shadow 
                ${isBooked 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-ballgreen text-white hover:bg-ballgreen/90'}
              `}
            >
              {time} - {endTime}
              <div className="text-xs mt-1">
                {isBooked ? 'Terisi' : 'Tersedia'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tombol Kembali */}
      <div className="flex justify-center">
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
