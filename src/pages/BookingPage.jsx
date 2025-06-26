import { useState } from 'react';

const mockCourts = [
  { id: 1, name: 'Court 1', type: 'Synthetic' },
  { id: 2, name: 'Court 2', type: 'Vinyl' },
];

const durations = [1, 2]; // hours

const BookingPage = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [court, setCourt] = useState(mockCourts[0].id);
  const [available, setAvailable] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const checkAvailability = () => {
    // Mock: always available
    setAvailable(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Book a Court</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Date</label>
          <input type="date" className="w-full border rounded px-3 py-2" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Start Time</label>
          <input type="time" className="w-full border rounded px-3 py-2" value={time} onChange={e => setTime(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Duration (hours)</label>
          <select className="w-full border rounded px-3 py-2" value={duration} onChange={e => setDuration(Number(e.target.value))}>
            {durations.map(d => <option key={d} value={d}>{d} hour{d > 1 ? 's' : ''}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Court</label>
          <select className="w-full border rounded px-3 py-2" value={court} onChange={e => setCourt(Number(e.target.value))}>
            {mockCourts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
          </select>
        </div>
        <div className="flex gap-4 mb-6">
          <button type="button" onClick={checkAvailability} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Check Availability</button>
          <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" disabled={!available}>Book Now</button>
        </div>
        {available === true && <div className="mb-2 text-green-600">Court is available!</div>}
        {available === false && <div className="mb-2 text-red-600">Court is not available.</div>}
        {submitted && <div className="mt-4 text-blue-600">Booking submitted (mock)!</div>}
      </form>
    </div>
  );
};

export default BookingPage; 