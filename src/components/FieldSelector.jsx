import React from 'react';
import { MapPin, Clock, Star } from 'lucide-react';
import courtsData from '../data/Court.json';

export default function FieldSelector({ onFieldSelect }) {
const fields = courtsData;

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);

  return (
    // PERUBAHAN DI SINI:
    // Mengubah dari grid menjadi flex untuk membuat lapangan sejajar dalam satu baris.
    // Tambahkan `overflow-x-auto` agar bisa discroll horizontal jika terlalu banyak item.
    // Gunakan `flex-nowrap` agar item tidak turun baris secara otomatis.
    <div className="flex flex-nowrap overflow-x-auto gap-8 pb-4"> 
      {fields.map((field) => (
        <div
          key={field.id}
          // PERUBAHAN DI SINI:
          // `flex-none w-72` agar setiap item memiliki lebar tetap dan tidak menciut
          className="flex-none w-72 bg-white rounded-2xl shadow-lg overflow-hidden transition hover:shadow-xl hover:scale-[1.01] cursor-pointer border border-ballgreen/20"
          onClick={() => onFieldSelect(field)}
        >
          <img
            src={field.image}
            alt={field.name}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-ballblack">{field.name}</h3>
              <div className="flex items-center text-ballorange gap-1">
                <Star className="w-4 h-4 fill-ballorange" />
                <span className="text-sm font-semibold">{field.rating}</span>
              </div>
            </div>
            <p className="text-sm text-ballblack/80 mb-3">{field.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {field.features.map((feature, index) => (
                <span
                  key={index}
                  className="bg-ballgreen/10 text-ballgreen text-xs px-3 py-1 rounded-full font-medium"
                >
                  {feature}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-ballgreen">
                {formatPrice(field.pricePerHour)}
                <span className="text-sm font-medium text-ballblack"> /jam</span>
              </span>
              
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}