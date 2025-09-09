import React, { useState, useEffect } from 'react';
import { Bus, ArrowLeft, RefreshCw, Search, Calendar, Phone } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const HistoryPage = ({ bookingHistory, navigate }) => {
  const [serverBookings, setServerBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);

  // Fetch bookings from server
  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_ENDPOINTS.BOOKINGS);
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

  // Filter bookings based on search criteria
  useEffect(() => {
    let filtered = allBookings;

    if (searchDate) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date);
        const searchDateObj = new Date(searchDate);
        return bookingDate.toDateString() === searchDateObj.toDateString();
      });
    }

    if (searchPhone) {
      filtered = filtered.filter(booking => {
        // Check if phone number exists in passengers or contact details
        const phoneMatch = booking.passengers?.some(passenger => 
          passenger.phone?.includes(searchPhone)
        ) || booking.contactPhone?.includes(searchPhone) || 
        booking.phone?.includes(searchPhone);
        return phoneMatch;
      });
    }

    setFilteredBookings(filtered);
  }, [allBookings, searchDate, searchPhone]);

  // Handle search
  const handleSearch = async () => {
    if (!searchDate && !searchPhone) {
      setError('Please enter either a date or phone number to search');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      if (searchDate) params.append('date', searchDate);
      if (searchPhone) params.append('phone', searchPhone);
      
      const response = await fetch(`${API_ENDPOINTS.BOOKINGS}?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setServerBookings(result.data);
      } else {
        setError('No bookings found for the given criteria');
      }
    } catch (error) {
      console.error('Error searching bookings:', error);
      setError('Unable to search bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchDate('');
    setSearchPhone('');
    setError('');
    fetchBookings(); // Reload all bookings
  };

  // Use filtered bookings for display
  const displayBookings = searchDate || searchPhone ? filteredBookings : allBookings;

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
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Search Bookings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Travel Date
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Searching...' : 'Search'}</span>
              </button>
              <button
                onClick={clearSearch}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Booking History</h3>
       
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

        {displayBookings.length === 0 && !loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Bus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            {(searchDate || searchPhone) ? (
              <>
                <h4 className="text-xl font-semibold text-gray-600 mb-2">No Bookings Found</h4>
                <p className="text-gray-500 mb-6">No bookings match your search criteria. Try different search terms.</p>
                <button onClick={clearSearch} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">Clear Search</button>
              </>
            ) : (
              <>
                <h4 className="text-xl font-semibold text-gray-600 mb-2">No Bookings Yet</h4>
                <p className="text-gray-500 mb-6">Start your journey by booking your first bus ticket</p>
                <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">Book Now</button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayBookings.map((booking) => (
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
