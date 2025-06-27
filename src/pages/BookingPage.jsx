import React, { useState } from 'react';
import FieldSelector from '../components/FieldSelector';
import DateSelector from '../components/DateSelector';
import TimeSelector from '../components/TimeSelector';
import BookingConfirmation from '../components/BookingConfirmation';
import BookingProgress from '../components/BookingProgress';

export default function BookingPage() {
  const [selectedField, setSelectedField] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

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

  const resetBooking = () => {
    setSelectedField(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setCurrentStep(1);
  };

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
                <FieldSelector onFieldSelect={handleFieldSelect} />
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
            />
          )}
        </div>
      </div>
    </div>
  );
}
