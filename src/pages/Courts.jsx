import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Users, Star } from "lucide-react";
import { courtAPI } from "../services/courtAPI";

export default function Courts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      setLoading(true);
      const { data, error } = await courtAPI.getActiveCourts();
      setCourts(data || []);
      setLoading(false);
    };
    fetchCourts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  if (loading) {
    return <div className="text-center py-12">Loading courts...</div>;
  }

  return (
    <div className="mt-16 mb-24 w-full max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-6 md:p-12 text-center">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-ballblack text-center">
        Our Courts
      </h1>
      <p className="text-center mb-10 text-gray-600">
        Pilih lapangan terbaik untuk pengalaman bermain yang tak terlupakan
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {courts.map((court) => (
          <div
            key={court.id}
            className="bg-ballgray/30 rounded-2xl shadow-lg p-4 flex flex-col"
          >
            <img
              src={court.image || 'https://placehold.co/400x300?text=No+Image'}
              alt={court.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            <h2 className="text-xl font-bold text-ballblack mb-1">
              {court.name}
            </h2>
            <p className="text-sm text-gray-600 mb-2">{court.description}</p>

            <div className="flex items-center text-sm text-gray-700 mb-1 gap-2">
              <Clock size={16} /> 06:00 - 23:00
            </div>
            <div className="flex items-center text-yellow-500 text-sm mb-3">
              <Star size={16} fill="currentColor" className="mr-1" />
              <span>{court.rating || 4.5}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {/* Jika ada fitur, tampilkan */}
              {court.features && court.features.map((feature, index) => (
                <span
                  key={index}
                  className="text-xs bg-ballgreen/10 text-ballgreen px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>

            <div className="mt-auto flex justify-between items-center">
              <div className="text-lg font-semibold text-ballorange">
                {formatPrice(court.price)}{" "}
                <span className="text-sm font-normal">/jam</span>
              </div>
              <Link
                to="/booking"
                className="bg-ballgreen text-white px-4 py-2 rounded-full font-semibold hover:bg-ballgreen/90 transition"
              >
                Booking Sekarang
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
