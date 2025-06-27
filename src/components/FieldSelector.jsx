import React from 'react';
import { MapPin, Clock, Star } from 'lucide-react';
// import courtsData from '../courtsData.json'; // Jika Anda memisahkan data ke JSON

export default function FieldSelector({ onFieldSelect }) {
  const fields = [
    {
      id: 1,
      name: 'Lapangan A',
      description: 'Lapangan standar FIFA dengan rumput sintetis premium',
      image: 'https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/99/2025/02/11/FotoJet-10-4023391602.jpg',
      pricePerHour: 150000,
      features: ['Rumput Sintetis', 'Pencahayaan LED', 'Parkir Gratis'],
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Lapangan B',
      description: 'Lapangan indoor dengan AC dan pencahayaan LED',
      image: 'https://centroflor.id/wp-content/uploads/2023/09/Lapangan-Futsal-Rumput-Sintetis-Halim.jpg',
      pricePerHour: 200000,
      features: ['Indoor', 'AC', 'Sound System'],
      rating: 4.9,
    },
    {
      id: 3,
      name: 'Lapangan C',
      description: 'Lapangan outdoor dengan view terbaik',
      image: 'https://asset.ayo.co.id/image/venue/170859092273542.image_cropper_1708590913966_large.jpg',
      pricePerHour: 120000,
      features: ['Outdoor', 'View Bagus', 'Tribun'],
      rating: 4.6,
    },
    {
      id: 4,
      name: 'Lapangan D',
      description: 'Lapangan premium dengan fasilitas lengkap',
      image: 'https://asset.ayo.co.id/image/venue/170749608971526.image_cropper_1707495991863_middle.jpg',
      pricePerHour: 250000,
      features: ['Premium', 'Ruang Ganti', 'Shower'],
      rating: 4.9,
    },
  ];
  // Jika data sudah dipisah ke JSON, gunakan ini sebagai ganti array di atas:
  // const fields = courtsData;

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
              <span className="text-sm text-ballblack/60 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                08:00 - 23:00
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}