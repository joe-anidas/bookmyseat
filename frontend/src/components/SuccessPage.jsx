import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessPage = ({ bookingHistory, navigate }) => {
  const latestBooking = bookingHistory[bookingHistory.length - 1];
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 success-page">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Successful!</h2>
          <p className="text-gray-600">Your bus ticket has been booked successfully</p>
        </div>
        {latestBooking && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-3">Booking Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Booking ID:</span><span className="font-medium">#{latestBooking.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Bus:</span><span className="font-medium">{latestBooking.bus}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Route:</span><span className="font-medium">{latestBooking.route}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Seats:</span><span className="font-medium">{latestBooking.seats.join(', ')}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Amount Paid:</span><span className="font-medium text-green-600">₹{latestBooking.amount}</span></div>
            </div>
          </div>
        )}
        <div className="text-sm text-gray-500 mb-4">Redirecting to home page in 3 seconds...</div>
        <button onClick={() => navigate('/')} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">Go to Home</button>
      </div>
    </div>
  );
};

export default SuccessPage;
