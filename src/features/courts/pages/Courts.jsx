import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Star, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { courtAPI } from "../../../shared/services/courtAPI";
import toast from "react-hot-toast";
import { supabase } from "../../../shared/constants/supabase";

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
        <div className="text-center">
          {/* Modern Loading Animation */}
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto border-4 border-ballgray rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ballgreen to-emerald-600 shadow-lg animate-pulse">
                <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 rounded-full border-2 border-white/40"></div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-lg font-semibold text-ballgreen animate-pulse">Loading courts...</p>
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-2 h-2 bg-ballgreen rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-ballgreen rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-ballgreen rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
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
    <div className="mt-16 mb-24 w-full max-w-6xl mx-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-ballgreen/5 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-ballorange/5 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-ballgreen/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-ballgreen via-green-500 to-ballorange bg-clip-text text-transparent">
            Premium Courts
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Pilih lapangan terbaik dengan fasilitas modern untuk pengalaman bermain yang tak terlupakan
          </p>
          
          {/* Modern Stats Bar */}
          <div className="flex justify-center items-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-ballgreen">{courts.length}</div>
              <div className="text-sm text-gray-600">Courts Available</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-ballorange">24/7</div>
              <div className="text-sm text-gray-600">Open Hours</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-ballgreen">5⭐</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
          
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
            className="bg-gradient-to-r from-ballgreen to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Courts
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courts.length > 0 ? (
            courts.map((court, index) => (
              <div
                key={court.id}
                className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] animate-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Overlay for Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-ballgreen/10 via-transparent to-ballorange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                
                <div className="relative z-20">
                  <div className="relative overflow-hidden">
                    <img
                      src={court.image}
                      alt={court.name}
                      className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/400x300?text=No+Image";
                      }}
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm ${getStatusColor(court.status)}`}>
                        {court.status}
                      </span>
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <Star size={14} fill="gold" className="text-yellow-400" />
                      <span className="text-xs font-bold text-white">{court.rating}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-ballblack mb-2 group-hover:text-ballgreen transition-colors">
                      {court.name}
                    </h2>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      📍 {court.location} • 🏟️ {court.type} • 👥 {court.capacity} players
                    </p>

                    {/* Operating Hours */}
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-700">
                      <Clock size={14} className="text-ballgreen" />
                      <span>{court.operating_hours}</span>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {court.features.length > 0 ? (
                        court.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gradient-to-r from-ballgreen/20 to-emerald-100 text-ballgreen px-3 py-1 rounded-full font-medium"
                          >
                            {feature}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500 italic">
                          Premium facilities available
                        </span>
                      )}
                      {court.features.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          +{court.features.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Price and Booking */}
                    <div className="flex justify-between items-center">
                      <div className="text-left">
                        <div className="text-2xl font-bold text-ballorange">
                          {formatPrice(court.price)}
                        </div>
                        <div className="text-sm text-gray-500">/hour</div>
                      </div>
                      
                      <Link
                        to={`/booking?courtId=${court.id}`}
                        state={{ courtData: court }}
                        className="group/btn relative overflow-hidden bg-gradient-to-r from-ballgreen to-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <span className="relative z-10">Book Now</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-ballgreen transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300"></div>
                      </Link>
                    </div>
                  </div>
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
    </div>
  );
}