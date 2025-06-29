import React from 'react';
import { MapPin, Clock, Star, AlertCircle } from 'lucide-react';

export default function FieldSelector({ courts = [], onFieldSelect }) {
  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price || 50000);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (courts.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No courts available</h3>
        <p className="text-gray-500">All courts are currently unavailable for booking.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-nowrap overflow-x-auto gap-8 pb-4"> 
      {courts.map((court) => (
        <div
          key={court.id}
          className="flex-none w-72 bg-white rounded-2xl shadow-lg overflow-hidden transition hover:shadow-xl hover:scale-[1.01] cursor-pointer border border-ballgreen/20"
          onClick={() => onFieldSelect(court)}
        >
          <div className="relative">
            <img
              src={court.image || '/src/assets/lapangan.jpg'}
              alt={court.name}
              className="w-full h-48 object-cover rounded-t-2xl"
            />
            <div className="absolute top-3 right-3">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(court.status)}`}>
                {court.status}
              </span>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-ballblack">{court.name}</h3>
              <div className="flex items-center text-ballorange gap-1">
                <Star className="w-4 h-4 fill-ballorange" />
                <span className="text-sm font-semibold">4.5</span>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{court.location}</span>
            </div>

            <p className="text-sm text-ballblack/80 mb-3">
              {court.type} court with capacity for {court.capacity} people
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-ballgreen/10 text-ballgreen text-xs px-3 py-1 rounded-full font-medium">
                {court.type}
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                {court.capacity} people
              </span>
              {court.status === 'Active' && (
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                  Available
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-ballgreen">
                {formatPrice(50000)}
                <span className="text-sm font-medium text-ballblack"> /jam</span>
              </span>
              
              {court.status !== 'Active' && (
                <span className="text-xs text-red-600 font-medium">
                  Not available for booking
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}