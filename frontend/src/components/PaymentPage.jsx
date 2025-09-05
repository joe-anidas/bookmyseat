import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const PaymentPage = ({ searchData, setSearchData, selectedBus, setSelectedBus, selectedSeats, setSelectedSeats, selectedBoardingPoint, setSelectedBoardingPoint, selectedDroppingPoint, setSelectedDroppingPoint, passengerDetails, setPassengerDetails, bookingHistory, setBookingHistory, navigate }) => {
  useEffect(() => {
    const savedSearchData = localStorage.getItem('searchData');
    const savedSelectedBus = localStorage.getItem('selectedBus');
    const savedSelectedSeats = localStorage.getItem('selectedSeats');
    const savedBoardingPoint = localStorage.getItem('selectedBoardingPoint');
    const savedDroppingPoint = localStorage.getItem('selectedDroppingPoint');
    const savedPassengerDetails = localStorage.getItem('passengerDetails');
    
    if (savedSearchData) setSearchData(JSON.parse(savedSearchData));
    if (savedSelectedBus) setSelectedBus(JSON.parse(savedSelectedBus));
    if (savedSelectedSeats) setSelectedSeats(JSON.parse(savedSelectedSeats));
    if (savedBoardingPoint) setSelectedBoardingPoint(savedBoardingPoint);
    if (savedDroppingPoint) setSelectedDroppingPoint(savedDroppingPoint);
    if (savedPassengerDetails) setPassengerDetails(JSON.parse(savedPassengerDetails));
  }, []);
  const totalPrice = selectedSeats.length * (selectedBus?.price || 0);
  const serviceTax = Math.round(totalPrice * 0.05);
  const finalAmount = totalPrice + serviceTax;
  const handlePayment = async () => {
    try {
      console.log('Starting payment process...');
      
      // Generate transaction ID
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      // Prepare booking data for API
      const bookingData = {
        id: Date.now().toString(),
        bus: selectedBus.name,
        route: `${searchData.from} → ${searchData.to}`,
        date: searchData.date,
        time: selectedBus.departureTime,
        seats: [...selectedSeats],
        passengers: passengerDetails,
        boardingPoint: selectedBoardingPoint || 'bp1',
        droppingPoint: selectedDroppingPoint || 'dp1',
        amount: finalAmount,
        status: 'Confirmed',
        bookingDate: new Date().toISOString().split('T')[0],
        paymentDetails: {
          method: 'Card',
          transactionId
        }
      };

      console.log('Booking data to be sent:', bookingData);

      // Send booking data to backend
      console.log('Sending request to backend...');
      const response = await fetch(API_ENDPOINTS.BOOKINGS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok && result.success) {
        console.log('Booking successful!');
        
        // Create booking object for local state (backward compatibility)
        const booking = {
          id: bookingData.id,
          bus: selectedBus.name,
          route: `${searchData.from} → ${searchData.to}`,
          date: searchData.date,
          time: selectedBus.departureTime,
          seats: [...selectedSeats],
          passengers: selectedSeats.length,
          amount: finalAmount,
          status: 'Confirmed',
          bookingDate: new Date().toISOString().split('T')[0]
        };
        
        setBookingHistory([...bookingHistory, booking]);
        
        // Clear localStorage
        localStorage.removeItem('searchData');
        localStorage.removeItem('availableBuses');
        localStorage.removeItem('selectedBus');
        localStorage.removeItem('selectedSeats');
        localStorage.removeItem('selectedBoardingPoint');
        localStorage.removeItem('selectedDroppingPoint');
        localStorage.removeItem('passengerDetails');
        
        navigate('/success');
      } else {
        console.error('Booking failed:', result);
        alert('Booking failed: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Booking failed. Please check console for details and try again.');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 payment-page">
      <header className="bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/passenger')} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Passenger Details</span>
          </button>
          <h2 className="text-xl font-semibold">Payment & Confirmation</h2>
          <div></div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Booking Summary</h3>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-semibold text-gray-800">{selectedBus.name}</h4>
                <p className="text-gray-600">{selectedBus.type}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-gray-600">Route:</span><span className="font-medium">{searchData.from} → {searchData.to}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Date:</span><span className="font-medium">{searchData.date}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Departure:</span><span className="font-medium">{selectedBus.departureTime}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Arrival:</span><span className="font-medium">{selectedBus.arrivalTime}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Selected Seats:</span><span className="font-medium">{selectedSeats.join(', ')}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Passengers:</span><span className="font-medium">{selectedSeats.length}</span></div>
              </div>
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-600">Base Fare:</span><span>₹{selectedBus.price} × {selectedSeats.length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Service Tax:</span><span>₹{serviceTax}</span></div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t"><span>Total Amount:</span><span className="text-blue-600">₹{finalAmount}</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Payment Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input type="text" placeholder="123" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <button onClick={handlePayment} className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105">Pay ₹{finalAmount}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
