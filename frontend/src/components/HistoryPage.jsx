import React from 'react';
import { Bus, ArrowLeft } from 'lucide-react';


const HistoryPage = ({ bookingHistory, navigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 history-page">
      <header className="bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <h2 className="text-xl font-semibold">My Bookings</h2>
          <div></div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto p-4">
        <h3 className="text-2xl font-bold mb-6">Booking History</h3>
        {bookingHistory.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Bus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-600 mb-2">No Bookings Yet</h4>
            <p className="text-gray-500 mb-6">Start your journey by booking your first bus ticket</p>
            <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">Book Now</button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookingHistory.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{booking.bus}</h4>
                    <p className="text-gray-600">{booking.route}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{booking.status}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium">{booking.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Time</p>
                    <p className="font-medium">{booking.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Seats</p>
                    <p className="font-medium">{booking.seats.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-medium text-blue-600">₹{booking.amount}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">Booking ID: #{booking.id}</p>
                  <p className="text-sm text-gray-600">Booked on: {booking.bookingDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
