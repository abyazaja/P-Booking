import React, { useState } from 'react';
import { Check, CreditCard, Wallet } from 'lucide-react';

export default function BookingConfirmation({ selectedField, selectedDate, selectedTime, onBack, onReset }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const handleConfirmBooking = async () => {
    if (!paymentMethod) {
      alert('Silakan pilih metode pembayaran');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulasi API call untuk menyimpan booking
      const bookingData = {
        fieldId: selectedField.id,
        fieldName: selectedField.name,
        date: selectedDate,
        time: selectedTime,
        price: selectedField.pricePerHour,
        paymentMethod: paymentMethod,
        status: 'pending'
      };

      // Dalam implementasi nyata, kirim data ke backend
      console.log('Booking data:', bookingData);
      
      // Simulasi delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Booking berhasil! Silakan lakukan pembayaran.');
      onReset();
      
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const endTime = String(parseInt(selectedTime.split(':')[0]) + 1).padStart(2, '0') + ':00';

  return (
    <div className="booking-confirmation">
      <div className="confirmation-header">
        <Check size={48} className="check-icon" />
        <h2>Konfirmasi Booking</h2>
      </div>

      <div className="booking-details-card">
        <h3>Detail Booking</h3>
        <div className="details-grid">
          <div className="detail-row">
            <span>Lapangan:</span>
            <strong>{selectedField?.name}</strong>
          </div>
          <div className="detail-row">
            <span>Tanggal:</span>
            <strong>{formatDate(selectedDate)}</strong>
          </div>
          <div className="detail-row">
            <span>Jam:</span>
            <strong>{selectedTime} - {endTime}</strong>
          </div>
          <div className="detail-row">
            <span>Durasi:</span>
            <strong>1 Jam</strong>
          </div>
          <div className="detail-row total">
            <span>Total Harga:</span>
            <strong>{formatPrice(selectedField?.pricePerHour)}</strong>
          </div>
        </div>
      </div>

      <div className="payment-section">
        <h3>Pilih Metode Pembayaran</h3>
        <div className="payment-methods">
          <div 
            className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('cash')}
          >
            <Wallet size={24} />
            <span>Bayar di Tempat</span>
          </div>
          <div 
            className={`payment-option ${paymentMethod === 'transfer' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('transfer')}
          >
            <CreditCard size={24} />
            <span>Transfer Bank</span>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <button className="btn-back" onClick={onBack} disabled={isProcessing}>
          Kembali
        </button>
        <button 
          className="btn-confirm" 
          onClick={handleConfirmBooking}
          disabled={isProcessing}
        >
          {isProcessing ? 'Memproses...' : 'Konfirmasi Booking'}
        </button>
      </div>
    </div>
  );
}