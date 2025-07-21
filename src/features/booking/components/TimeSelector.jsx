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
      const startIdx = allTimes.indexOf(selectedTime);
      const endIdx = startIdx + duration;
      const endTime = allTimes[endIdx] || '23:00';

      onTimeSelect({
        start: selectedTime + ':00',
        end: endTime + ':00',
        duration: duration
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-10 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">Pilih Jam & Durasi</h2>

      <div className="bg-green-50 rounded-2xl p-4 mb-6 text-left space-y-2">
        <p><strong>Lapangan:</strong> {selectedField?.name}</p>
        <p><strong>Tanggal:</strong> {formatDate(selectedDate)}</p>
        <p><strong>Harga:</strong> {formatPrice(selectedField?.price || 50000)} / jam</p>
      </div>

      <div className="mb-4 text-left">
        <label className="block font-medium mb-2">Durasi (jam)</label>
        <input
          type="number"
          min="1"
          max="6"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
          className="w-24 px-3 py-2 border rounded-lg"
        />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
        {allTimes.map((time) => {
          const isAvailable = checkAvailability(time, duration);
          return (
            <button
              key={time}
              onClick={() => isAvailable && setSelectedTime(time)}
              disabled={!isAvailable}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                !isAvailable
                  ? 'bg-gray-200 text-gray-500'
                  : selectedTime === time
                    ? 'bg-orange-500 text-white'
                    : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {time}
              <div className="text-xs mt-1">
                {!isAvailable ? 'Tidak tersedia' : selectedTime === time ? 'Dipilih' : 'Tersedia'}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="px-6 py-2 rounded-full bg-gray-800 text-white">Kembali</button>
        <button
          onClick={handleConfirm}
          disabled={!selectedTime || !checkAvailability(selectedTime, duration)}
          className="px-6 py-2 rounded-full bg-green-600 text-white disabled:opacity-50"
        >
          Konfirmasi
        </button>
      </div>
    </div>
  );
}
