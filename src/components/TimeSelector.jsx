import React, { useState, useEffect } from 'react';

export default function TimeSelector({ selectedField, selectedDate, onTimeSelect, onBack }) {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [duration, setDuration] = useState(1);
  const [selectedTime, setSelectedTime] = useState(null);

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
    if (!(date instanceof Date)) return '-';
    try {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      // Fallback format if locale fails
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const formatPrice = (price) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR'
      }).format(price);
    } catch (error) {
      // Fallback format if locale fails
      return `Rp ${price?.toLocaleString() || 0}`;
    }
  };

  const checkAvailability = (startTime, duration) => {
    const startIdx = allTimes.indexOf(startTime);
    if (startIdx === -1 || startIdx + duration > allTimes.length) return false;

    for (let i = 0; i < duration; i++) {
      const timeToCheck = allTimes[startIdx + i];
      if (bookedTimes.includes(timeToCheck)) return false;
    }
    return true;
  };

  const handleConfirm = () => {
    if (selectedTime && checkAvailability(selectedTime, duration)) {
      // Calculate end time based on start time and duration
      const startIdx = allTimes.indexOf(selectedTime);
      const endIdx = startIdx + duration;
      const endTime = allTimes[endIdx] || '23:00'; // Default to 23:00 if beyond available times
      
      onTimeSelect({ 
        start: selectedTime + ':00', // Add seconds to match database format
        end: endTime + ':00'         // Add seconds to match database format
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-6 md:p-10 text-center relative overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold text-ballblack mb-4">Pilih Jam & Durasi</h2>

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

      {/* Input Durasi */}
      <div className="mb-4 text-left">
        <label className="block font-medium text-ballblack mb-2">Durasi (jam)</label>
        <input
          type="number"
          min="1"
          max="6"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
          className="w-24 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-ballgreen"
        />
      </div>

      {/* Pilihan Jam */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
        {allTimes.map((time, idx) => {
          const isAvailable = checkAvailability(time, duration);

          return (
            <button
              key={time}
              onClick={() => isAvailable && setSelectedTime(time)}
              disabled={!isAvailable}
              className={`
                px-4 py-3 rounded-xl text-sm font-medium transition shadow 
                ${!isAvailable 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : selectedTime === time 
                    ? 'bg-ballorange text-white'
                    : 'bg-ballgreen text-white hover:bg-ballgreen/90'}
              `}
            >
              {time}
              <div className="text-xs mt-1">
                {!isAvailable ? 'Tidak tersedia' : selectedTime === time ? 'Dipilih' : 'Tersedia'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tombol Aksi */}
      <div className="flex justify-between mt-6">
        <button
          className="px-6 py-2 rounded-full bg-ballblack text-white font-semibold hover:bg-ballblack/90 transition"
          onClick={onBack}
        >
          Kembali
        </button>

        <button
          className="px-6 py-2 rounded-full bg-ballgreen text-white font-semibold hover:bg-ballgreen/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleConfirm}
          disabled={!selectedTime || !checkAvailability(selectedTime, duration)}
        >
          Konfirmasi
        </button>
      </div>
    </div>
  );
}
