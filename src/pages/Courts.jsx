import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Star, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { courtAPI } from "../services/courtAPI";
import toast from "react-hot-toast";
import { supabase } from "../config/supabase";

export default function Courts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const fetchCourts = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo(null);
      
      console.log("🔄 Starting to fetch courts...");
      
      // Debug: Check if courtAPI exists and has getActiveCourts method
      if (!courtAPI) {
        throw new Error("courtAPI is not defined");
      }
      
      if (typeof courtAPI.getActiveCourts !== 'function') {
        throw new Error("courtAPI.getActiveCourts is not a function");
      }
      
      console.log("✅ courtAPI methods available:", Object.keys(courtAPI));
      
      // Fetch courts data
      const { data, error: apiError } = await courtAPI.getActiveCourts();
      
      console.log("📊 Raw API Response:", { data, apiError });
      
      if (apiError) {
        console.error("❌ API Error:", apiError);
        throw apiError;
      }

      // Debug info for troubleshooting
      const debugData = {
        rawDataType: typeof data,
        rawDataLength: Array.isArray(data) ? data.length : 'Not an array',
        rawData: data,
        firstItem: Array.isArray(data) && data.length > 0 ? data[0] : null
      };
      
      setDebugInfo(debugData);
      console.log("🔍 Debug Info:", debugData);

      // Check if data exists and is an array
      if (!data) {
        console.warn("⚠️ No data returned from API");
        setCourts([]);
        return;
      }

      if (!Array.isArray(data)) {
        console.warn("⚠️ Data is not an array:", typeof data);
        setCourts([]);
        return;
      }

      if (data.length === 0) {
        console.warn("⚠️ Data array is empty");
        setCourts([]);
        return;
      }

      // Transform data with better error handling
      const formattedData = data.map((court, index) => {
        console.log(`🏟️ Processing court ${index + 1}:`, court);
        
        return {
          id: court.id || `court-${index}`,
          name: court.name || "Unknown Court",
          image: court.image || "https://placehold.co/400x300?text=No+Image",
          description: court.description || "No description available",
          location: court.location || "Location not specified",
          type: court.type || "Type not specified",
          status: court.status || "Active", // Changed default to Active
          price: court.price_per_hour || court.price || 0,
          rating: court.rating || "4.5",
          features: Array.isArray(court.features) ? court.features : [],
          operating_hours: court.operating_hours || "06:00 - 23:00",
          capacity: court.capacity || "Not specified"
        };
      });

      console.log("✅ Formatted data:", formattedData);
      setCourts(formattedData);
      
    } catch (err) {
      console.error("🚨 Error fetching courts:", err);
      setError(err.message);
      toast.error(`Failed to load courts: ${err.message}`);
      setCourts([]);
    } finally {
      setLoading(false);
    }
  };

  // Alternative fetch method for debugging
  const fetchCourtsAlternative = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Trying alternative fetch method...");
      
      // Direct Supabase query as fallback
      const { data, error } = await supabase
        .from('courts')
        .select('*')
        .eq('status', 'Active');
      
      console.log("📊 Direct Supabase Response:", { data, error });
      
      if (error) throw error;
      
      if (data && Array.isArray(data)) {
        const formattedData = data.map(court => ({
          id: court.id,
          name: court.name || "Unknown Court",
          image: court.image || "https://placehold.co/400x300?text=No+Image",
          description: court.description || "No description available",
          location: court.location || "Location not specified",
          type: court.type || "Type not specified",
          status: court.status || "Active",
          price: court.price || 0,
          rating: "4.5",
          features: [],
          operating_hours: "06:00 - 23:00",
          capacity: court.capacity || "Not specified"
        }));
        
        setCourts(formattedData);
        toast.success("Courts loaded successfully!");
      }
      
    } catch (err) {
      console.error("🚨 Alternative fetch error:", err);
      setError(err.message);
      toast.error(`Alternative fetch failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading courts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 mb-24 w-full max-w-4xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-6 md:p-12">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="text-lg font-medium text-gray-900 mt-4">Error Loading Courts</h3>
          <p className="text-gray-500 mt-2">{error}</p>
          
          {/* Debug Information */}
          {debugInfo && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
              <h4 className="font-semibold mb-2">Debug Information:</h4>
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="flex gap-4 justify-center mt-6">
            <button 
              onClick={fetchCourts}
              className="bg-ballgreen text-white px-4 py-2 rounded-full font-semibold hover:bg-ballgreen/90 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button 
              onClick={fetchCourtsAlternative}
              className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition"
            >
              Try Alternative Method
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 mb-24 w-full max-w-4xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-6 md:p-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-ballblack">
          Our Courts
        </h1>
        <p className="text-gray-600 mb-4">
          Pilih lapangan terbaik untuk pengalaman bermain yang tak terlupakan
        </p>
        
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-3 bg-blue-50 rounded-lg text-sm text-left">
            <strong>Debug Info:</strong> Found {courts.length} courts
            {courts.length > 0 && (
              <div className="mt-2">
                <strong>First court:</strong> {courts[0]?.name} - {courts[0]?.status}
              </div>
            )}
          </div>
        )}
        
        <button 
          onClick={fetchCourts}
          className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-600 transition flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Courts
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {courts.length > 0 ? (
          courts.map((court) => (
            <div
              key={court.id}
              className="bg-ballgray/30 rounded-2xl shadow-lg p-4 flex flex-col hover:shadow-xl transition-all"
            >
              <div className="relative">
                <img
                  src={court.image}
                  alt={court.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x300?text=No+Image";
                  }}
                />
                <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(court.status)}`}>
                  {court.status}
                </span>
              </div>

              <h2 className="text-xl font-bold text-ballblack mb-1">
                {court.name}
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                {court.location} • {court.type} • Capacity: {court.capacity}
              </p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-sm text-gray-700 gap-2">
                  <Clock size={16} /> {court.operating_hours}
                </div>
                <div className="flex items-center text-yellow-500 text-sm">
                  <Star size={16} fill="currentColor" className="mr-1" />
                  <span>{court.rating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {court.features.length > 0 ? (
                  court.features.map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs bg-ballgreen/10 text-ballgreen px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">
                    No features listed
                  </span>
                )}
              </div>

              <div className="mt-auto flex justify-between items-center">
                <div className="text-lg font-semibold text-ballorange">
                  {formatPrice(court.price)} <span className="text-sm font-normal">/jam</span>
                </div>
                <Link
                  to={`/booking?courtId=${court.id}`}
                  state={{ courtData: court }}
                  className="bg-ballgreen text-white px-4 py-2 rounded-full font-semibold hover:bg-ballgreen/90 transition"
                >
                  Booking Sekarang
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Courts Available
            </h3>
            <p className="text-gray-500 mb-4">
              There are currently no courts to display.
            </p>
            <button 
              onClick={fetchCourtsAlternative}
              className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition"
            >
              Try Loading Courts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}