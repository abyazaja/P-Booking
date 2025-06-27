import React from 'react';
import { MapPin, Calendar, Clock, DollarSign } from 'lucide-react';

export default function BookingProgress({ currentStep, onStepChange }) {
  const steps = [
    { id: 1, icon: MapPin, label: 'Pilih Lapangan' },
    { id: 2, icon: Calendar, label: 'Pilih Tanggal' },
    { id: 3, icon: Clock, label: 'Pilih Jam' },
    { id: 4, icon: DollarSign, label: 'Konfirmasi' }
  ];

  return (
    <div className="flex justify-center items-center my-8 gap-x-6">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep >= step.id;
        const isClickable = currentStep > step.id;

        return (
          <div key={step.id} className="relative flex items-center">
            <div 
              className={`
                flex flex-col items-center justify-center 
                p-3 md:p-4 rounded-full 
                transition-all duration-300 ease-in-out 
                text-sm md:text-base font-semibold 
                min-w-[100px] md:min-w-[120px] lg:min-w-[150px]
                ${isActive 
                  ? 'bg-ballgreen text-white shadow-md' 
                  : 'bg-gray-200 text-gray-600'}
                ${isClickable 
                  ? 'cursor-pointer hover:bg-ballgreen-darker' 
                  : 'cursor-not-allowed'}
              `}
              onClick={() => isClickable && onStepChange(step.id)}
            >
              <Icon size={24} className="mb-1" />
              <span className="text-center">{step.label}</span>
            </div>

            {index < steps.length - 1 && (
              <div 
                className={`
                  absolute left-[calc(100%+0.5rem)] md:left-[calc(100%+0.75rem)] 
                  h-1 bg-gray-300 
                  transition-all duration-300 ease-in-out
                  ${currentStep > step.id ? 'bg-ballgreen w-8 md:w-12 lg:w-16' : 'w-8 md:w-12 lg:w-16'}
                `}
                style={{ marginLeft: '10px' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
