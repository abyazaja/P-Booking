import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { courtAPI } from '../services/courtAPI';
import { bookingAPI } from '../services/bookingAPI';
import { useNotifications } from '../context/NotificationContext';
import FieldSelector from '../components/FieldSelector';
import DateSelector from '../components/DateSelector';
import TimeSelector from '../components/TimeSelector';
import BookingConfirmation from '../components/BookingConfirmation';
import BookingProgress from '../components/BookingProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

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
      console.error('Error fetching courts:', error);
      toast.error('Failed to load courts');
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
      
      console.log('Starting booking submission...');
      console.log('Selected field:', selectedField);
      console.log('Selected date:', selectedDate);
      console.log('Selected time:', selectedTime);
      console.log('User:', user);
      
      // Format date to YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      // Check availability
      const { data: conflicts, error: availabilityError } = await bookingAPI.checkAvailability(
        selectedField.id,
        formattedDate,
        selectedTime.start,
        selectedTime.end
      );

      if (availabilityError) {
        console.error('Availability check failed:', availabilityError);
        throw availabilityError;
      }

      console.log('Availability check result:', conflicts);

      if (conflicts && conflicts.length > 0) {
        toast.error('Selected time slot is not available. Please choose another time.');
        return;
      }

      // Create booking
      const bookingPayload = {
        user_id: user.id,
        court_id: selectedField.id,
        date: formattedDate,
        start_time: selectedTime.start,
        end_time: selectedTime.end,
        notes: bookingData.notes || '',
        status: 'pending'
      };

      console.log('Creating booking with payload:', bookingPayload);

      const { data: newBooking, error: bookingError } = await bookingAPI.createBooking(bookingPayload);

      if (bookingError) {
        console.error('Booking creation failed:', bookingError);
        throw bookingError;
      }

      console.log('Booking created successfully:', newBooking);

      // Create notification for admin
      try {
        await createNotification(
          'admin', // You might want to get admin user IDs dynamically
          `New booking request from ${user.name} for ${selectedField.name} on ${formattedDate}`,
          'info'
        );
      } catch (notificationError) {
        console.warn('Failed to create notification:', notificationError);
        // Don't fail the booking if notification fails
      }

      toast.success('Booking submitted successfully! Waiting for admin approval.');
      resetBooking();
      
    } catch (error) {
      console.error('Error creating booking:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('RLS')) {
        toast.error('Permission denied. Please make sure you are logged in.');
      } else if (error.message?.includes('foreign key')) {
        toast.error('Invalid court or user data. Please try again.');
      } else if (error.message?.includes('not null')) {
        toast.error('Missing required booking information. Please fill all fields.');
      } else {
        toast.error('Failed to create booking. Please try again.');
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
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (courts.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courts available</h3>
          <p className="text-gray-500">All courts are currently unavailable for booking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-14 px-4 md:px-12">
      <div className="max-w-7xl mx-auto bg-white p-6 md:p-12 rounded-xl shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-ballblack">
          Booking Lapangan Futsal
        </h2>

        {/* Booking progress indicator */}
        <div className="mb-10">
          <BookingProgress currentStep={currentStep} onStepChange={handleStepChange} />
        </div>

        {/* Step-based content */}
        <div className="space-y-10">
          {currentStep === 1 && (
            <div className="flex justify-center items-start gap-10">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-6 text-ballblack">
                  Pilih Lapangan:
                </h3>
                <FieldSelector 
                  courts={courts}
                  onFieldSelect={handleFieldSelect} 
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <DateSelector
              selectedField={selectedField}
              onDateSelect={handleDateSelect}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <TimeSelector
              selectedField={selectedField}
              selectedDate={selectedDate}
              onTimeSelect={handleTimeSelect}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <BookingConfirmation
              selectedField={selectedField}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onBack={() => setCurrentStep(3)}
              onReset={resetBooking}
              onSubmit={handleBookingSubmit}
              submitting={submitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
