import React, { useState, useEffect } from 'react';
import { Bus, ArrowLeft, RefreshCw } from 'lucide-react';


const HistoryPage = ({ bookingHistory, navigate }) => {
  const [serverBookings, setServerBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch bookings from server
  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5001/api/bookings');
      const result = await response.json();
      
      if (result.success) {
        setServerBookings(result.data);
      } else {
        setError('Failed to fetch bookings: ' + result.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Unable to connect to server. Showing local bookings only.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Combine server bookings with local bookings (remove duplicates)
  const allBookings = [...serverBookings];
  
  // Add local bookings that are not in server bookings
  bookingHistory.forEach(localBooking => {
    const existsInServer = serverBookings.some(serverBooking => 
      serverBooking.id === localBooking.id.toString()
    );
    if (!existsInServer) {
      allBookings.push({
        ...localBooking,
        passengers: Array.isArray(localBooking.passengers) 
          ? localBooking.passengers 
          : [{ name: 'Guest Passenger' }],
        isLocal: true
      });
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 history-page">
      <header className="bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <h2 className="text-xl font-semibold">My Bookings</h2>
          <button 
            onClick={fetchBookings} 
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Booking History</h3>
          <div className="text-sm text-gray-600">
            {serverBookings.length > 0 && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                {serverBookings.length} from server
              </span>
            )}
            {bookingHistory.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
                {bookingHistory.length} local
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 text-blue-600 mx-auto animate-spin mb-2" />
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        )}

        {allBookings.length === 0 && !loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Bus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-600 mb-2">No Bookings Yet</h4>
            <p className="text-gray-500 mb-6">Start your journey by booking your first bus ticket</p>
            <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">Book Now</button>
          </div>
        ) : (
          <div className="space-y-4">
            {allBookings.map((booking) => (
              <div key={booking.id || booking._id} className="bg-white rounded-xl shadow-lg p-6 relative">
                {booking.isLocal && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Local</span>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{booking.bus}</h4>
                    <p className="text-gray-600">{booking.route}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                    booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
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
                    <p className="font-medium">
                      {Array.isArray(booking.seats) ? booking.seats.join(', ') : booking.seats}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-medium text-blue-600">₹{booking.amount}</p>
                  </div>
                </div>

                {/* Passenger Details */}
                {booking.passengers && Array.isArray(booking.passengers) && booking.passengers.length > 0 && (
                  <div className="border-t pt-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">Passengers:</p>
                    <div className="space-y-1">
                      {booking.passengers.map((passenger, index) => (
                        <p key={index} className="text-sm font-medium">
                          {passenger.name || `Passenger ${index + 1}`}
                          {passenger.email && ` (${passenger.email})`}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Booking ID: #{booking.id || booking._id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Booked on: {booking.bookingDate}
                  </p>
                </div>
                
                {booking.paymentDetails && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">
                      Transaction ID: {booking.paymentDetails.transactionId}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
