import React, { useState, useEffect } from "react";
import { useAuth } from "../../../shared/hooks/AuthContext";
import { courtAPI } from "../../../shared/services/courtAPI";
import { bookingAPI } from "../../../shared/services/bookingAPI";
import { useNotifications } from "../../../shared/hooks/NotificationContext";
import FieldSelector from "../components/FieldSelector";
import DateSelector from "../components/DateSelector";
import TimeSelector from "../components/TimeSelector";
import BookingConfirmation from "../components/BookingConfirmation";
import BookingProgress from "../components/BookingProgress";
import LoadingSpinner from "../../../shared/components/ui/LoadingSpinner";
import { AlertCircle, CheckCircle, MapPin, Calendar, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function BookingPage() {
  const { user } = useAuth();
  const { createNotification } = useNotifications();

  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchActiveCourts();
  }, []);

  const fetchActiveCourts = async () => {
    try {
      setLoading(true);
      const { data, error } = await courtAPI.getActiveCourts();

      if (error) throw error;

      setCourts(data || []);
    } catch (error) {
      console.error("Error fetching courts:", error);
      toast.error("Failed to load courts");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldSelect = (field) => {
    setSelectedField(field);
    setCurrentStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentStep(3);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setCurrentStep(4);
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      setSubmitting(true);

      console.log("Starting booking submission...");
      console.log("Selected field:", selectedField);
      console.log("Selected date:", selectedDate);
      console.log("Selected time:", selectedTime);
      console.log("User:", user);

      // Format date to YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split("T")[0];

      // Check availability
      const { data: conflicts, error: availabilityError } =
        await bookingAPI.checkAvailability(
          selectedField.id,
          formattedDate,
          selectedTime.start,
          selectedTime.end
        );

      if (availabilityError) {
        console.error("Availability check failed:", availabilityError);
        throw availabilityError;
      }

      console.log("Availability check result:", conflicts);

      if (conflicts && conflicts.length > 0) {
        toast.error(
          "Selected time slot is not available. Please choose another time."
        );
        return;
      }

      // Create booking
      const bookingPayload = {
        user_id: user.id,
        court_id: selectedField.id,
        date: formattedDate,
        start_time: selectedTime.start,
        end_time: selectedTime.end,
        notes: bookingData.notes || "",
        status: "pending",
      };

      console.log("Creating booking with payload:", bookingPayload);

      const { data: newBooking, error: bookingError } =
        await bookingAPI.createBooking(bookingPayload);

      if (bookingError) {
        console.error("Booking creation failed:", bookingError);
        throw bookingError;
      }

      console.log("Booking created successfully:", newBooking);

      // Send comprehensive success message to user
      const bookingDate = selectedDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const successMessage = `✅ BOOKING BERHASIL DIBUAT!\n\n` +
        `Detail booking Anda:\n` +
        `📍 Lapangan: ${selectedField.name}\n` +
        `📅 Tanggal: ${bookingDate}\n` +
        `⏰ Waktu: ${selectedTime.start} - ${selectedTime.end}\n\n` +
        `Status: Menunggu persetujuan admin\n\n` +
        `Anda akan mendapat notifikasi ketika:\n` +
        `• Booking disetujui/ditolak\n` +
        `• Ada instruksi pembayaran\n` +
        `• Informasi penting lainnya\n\n` +
        `Terima kasih! 🚀`;
      
      // Create notification for user as confirmation
      try {
        await createNotification(
          user.id,
          successMessage,
          "success"
        );
      } catch (notificationError) {
        console.warn("Failed to create user notification:", notificationError);
      }

      toast.success(
        "Booking berhasil! Silakan cek notifikasi untuk update status."
      );
      resetBooking();
    } catch (error) {
      console.error("Error creating booking:", error);

      // Provide more specific error messages
      if (error.message?.includes("RLS")) {
        toast.error("Permission denied. Please make sure you are logged in.");
      } else if (error.message?.includes("foreign key")) {
        toast.error("Invalid court or user data. Please try again.");
      } else if (error.message?.includes("not null")) {
        toast.error(
          "Missing required booking information. Please fill all fields."
        );
      } else {
        toast.error("Failed to create booking. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetBooking = () => {
    setSelectedField(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setCurrentStep(1);
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading available courts..." />;
  }

  if (courts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ballwhite to-ballgray flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-r from-ballgreen/20 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-ballgreen" />
          </div>
          <h3 className="text-2xl font-bold text-ballblack mb-4">No Courts Available</h3>
          <p className="text-gray-600 mb-6">
            All courts are currently unavailable for booking. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-ballgreen text-white px-6 py-3 rounded-full font-semibold hover:bg-ballgreen/90 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ballwhite to-ballgray relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-ballgreen/5 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-ballorange/5 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-ballgreen/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 rounded-full bg-ballorange/3 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-ballgreen via-green-500 to-ballorange bg-clip-text text-transparent">
                Book Your Court
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Choose your perfect court and time for an amazing futsal experience
              </p>
            </div>

            {/* Enhanced Progress Indicator */}
            <div className="mt-8">
              <BookingProgress
                currentStep={currentStep}
                onStepChange={handleStepChange}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
            {/* Step Header */}
            <div className="bg-gradient-to-r from-ballgreen/10 via-emerald-50 to-ballorange/10 p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-ballblack">
                    {currentStep === 1 && "Step 1: Choose Your Court"}
                    {currentStep === 2 && "Step 2: Select Date"}
                    {currentStep === 3 && "Step 3: Pick Time Slot"}
                    {currentStep === 4 && "Step 4: Confirm Booking"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {currentStep === 1 && "Select from our premium courts"}
                    {currentStep === 2 && "Choose your preferred date"}
                    {currentStep === 3 && "Pick your time slot"}
                    {currentStep === 4 && "Review and confirm your booking"}
                  </p>
                </div>
                
                {/* Current Step Visual Indicator */}
                <div className="text-right">
                  <div className="text-4xl font-black text-ballgreen mb-1">
                    {currentStep}/4
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.round((currentStep / 4) * 100)}% Complete
                  </div>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6 md:p-8">
              {currentStep === 1 && (
                <div className="animate-in slide-in-from-right-4 duration-500">
                  <FieldSelector
                    courts={courts}
                    onFieldSelect={handleFieldSelect}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="animate-in slide-in-from-right-4 duration-500">
                  <DateSelector
                    selectedField={selectedField}
                    onDateSelect={handleDateSelect}
                    onBack={() => setCurrentStep(1)}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="animate-in slide-in-from-right-4 duration-500">
                  <TimeSelector
                    selectedField={selectedField}
                    selectedDate={selectedDate}
                    onTimeSelect={handleTimeSelect}
                    onBack={() => setCurrentStep(2)}
                  />
                </div>
              )}

              {currentStep === 4 && (
                <div className="animate-in slide-in-from-right-4 duration-500">
                  <BookingConfirmation
                    selectedField={selectedField}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onBack={() => setCurrentStep(3)}
                    onReset={resetBooking}
                    onSubmit={handleBookingSubmit}
                    submitting={submitting}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary Sidebar (Fixed on larger screens) */}
          {(selectedField || selectedDate || selectedTime) && (
            <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 animate-in slide-in-from-bottom-4">
              <h3 className="text-lg font-bold text-ballblack mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-ballgreen" />
                Booking Summary
              </h3>
              
              <div className="space-y-3">
                {selectedField && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-ballgreen/10">
                    <MapPin className="w-5 h-5 text-ballgreen" />
                    <div>
                      <div className="font-semibold text-ballgreen">{selectedField.name}</div>
                      <div className="text-sm text-gray-600">{selectedField.location}</div>
                    </div>
                  </div>
                )}
                
                {selectedDate && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-ballorange/10">
                    <Calendar className="w-5 h-5 text-ballorange" />
                    <div>
                      <div className="font-semibold text-ballorange">
                        {selectedDate.toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedTime && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-100">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-semibold text-gray-700">
                        {selectedTime.start} - {selectedTime.end}
                      </div>
                      <div className="text-sm text-gray-600">Duration: 2 hours</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
