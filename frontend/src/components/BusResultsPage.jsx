import React, { useEffect, useState } from 'react';
import { Bus, ArrowLeft, Star, RefreshCw } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const BusResultsPage = ({ searchData, setSearchData, availableBuses, setAvailableBuses, setSelectedBus, navigate }) => {
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [busesWithBookedSeats, setBusesWithBookedSeats] = useState([]);

  // Fetch booked seats for all buses
  const fetchBookedSeatsForAllBuses = async (buses) => {
    if (!buses || buses.length === 0 || !searchData) return buses;
    
    setLoading(true);
    setFetchError('');
    
    try {
      const route = `${searchData.from} → ${searchData.to}`;
      const updatedBuses = await Promise.all(
        buses.map(async (bus) => {
          try {
            const response = await fetch(
              `${API_ENDPOINTS.BOOKED_SEATS}?bus=${encodeURIComponent(bus.name)}&route=${encodeURIComponent(route)}&date=${encodeURIComponent(searchData.date)}`
            );
            
            if (response.ok) {
              const result = await response.json();
              if (result.success) {
                // Update bus seats with booked information
                const updatedBus = { ...bus };
                updatedBus.seats = updatedBus.seats.map(seat => {
                  if (result.data.bookedSeats.includes(seat.number)) {
                    return { ...seat, status: 'booked' };
                  }
                  // If seat was previously marked as booked but not in server data, mark as available
                  else if (seat.status === 'booked' && seat.type !== 'driver') {
                    return { ...seat, status: 'available' };
                  }
                  return seat;
                });
                return updatedBus;
              }
            } else {
              console.error(`Failed to fetch booked seats for ${bus.name}:`, response.statusText);
            }
          } catch (error) {
            console.error(`Error fetching booked seats for ${bus.name}:`, error);
          }
          
          // Return original bus if fetch failed
          return bus;
        })
      );
      
      return updatedBuses;
    } catch (error) {
      console.error('Error fetching booked seats for buses:', error);
      setFetchError('Unable to fetch latest seat availability. Showing cached data.');
      return buses;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const savedSearchData = localStorage.getItem('searchData');
    const savedBuses = localStorage.getItem('availableBuses');
    if (savedSearchData) setSearchData(JSON.parse(savedSearchData));
    if (savedBuses) setAvailableBuses(JSON.parse(savedBuses));
  }, []);

  // Fetch booked seats when buses or search data changes
  useEffect(() => {
    if (availableBuses.length > 0 && searchData) {
      const fetchAndUpdateSeats = async () => {
        const updatedBuses = await fetchBookedSeatsForAllBuses(availableBuses);
        setBusesWithBookedSeats(updatedBuses);
        setAvailableBuses(updatedBuses);
        
        // Save updated buses to localStorage
        localStorage.setItem('availableBuses', JSON.stringify(updatedBuses));
      };
      
      fetchAndUpdateSeats();
    } else {
      setBusesWithBookedSeats(availableBuses);
    }
  }, [availableBuses.length, searchData?.date, searchData?.from, searchData?.to]);

  useEffect(() => {
    if (availableBuses.length === 0) navigate('/');
  }, [availableBuses, navigate]);
  return (
    <div className="min-h-screen bg-gray-50 bus-results-page">
      <header className="bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Search</span>
          </button>
          <div className="text-center">
            <h2 className="text-xl font-semibold">{searchData.from} → {searchData.to}</h2>
            <p className="text-gray-600">{searchData.date} • {searchData.passengers} passenger{searchData.passengers > 1 ? 's' : ''}</p>
          </div>
          <button 
            onClick={async () => {
              const updatedBuses = await fetchBookedSeatsForAllBuses(availableBuses);
              setBusesWithBookedSeats(updatedBuses);
              setAvailableBuses(updatedBuses);
              localStorage.setItem('availableBuses', JSON.stringify(updatedBuses));
            }}
            disabled={loading}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </header>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Available Buses ({busesWithBookedSeats.length})</h3>
          {loading && (
            <div className="flex items-center space-x-2 text-blue-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Updating seat availability...</span>
            </div>
          )}
        </div>

        {fetchError && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            {fetchError}
          </div>
        )}

        {busesWithBookedSeats.length === 0 ? (
          <div className="text-center py-12">
            <Bus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-600 mb-2">No Buses Found</h4>
            <p className="text-gray-500">Try adjusting your search criteria or date</p>
            <button onClick={() => navigate('/')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Back to Search</button>
          </div>
        ) : (
          <div className="space-y-4">
            {busesWithBookedSeats.map((bus) => {
              const availableSeats = bus.seats.filter(seat => seat.status === 'available').length;
              return (
                <div key={bus.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">{bus.name}</h4>
                      <p className="text-gray-600">{bus.type}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{bus.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">₹{bus.price}</p>
                      <p className="text-sm text-gray-600">per seat</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-8">
                      <div>
                        <p className="text-lg font-semibold">{bus.departureTime}</p>
                        <p className="text-sm text-gray-600">{searchData.from}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">{bus.travelHours}</p>
                        <div className="w-16 h-px bg-gray-300 my-1"></div>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{bus.arrivalTime}</p>
                        <p className="text-sm text-gray-600">{searchData.to}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <p className={`text-sm font-medium ${
                        availableSeats > 10 ? 'text-green-600' : 
                        availableSeats > 5 ? 'text-yellow-600' : 
                        availableSeats > 0 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {availableSeats > 0 ? `${availableSeats} seats available` : 'No seats available'}
                      </p>
                      {loading && (
                        <span className="text-xs text-gray-500">Updating...</span>
                      )}
                    </div>
                    <button 
                      onClick={() => { 
                        setSelectedBus(bus); 
                        localStorage.setItem('selectedBus', JSON.stringify(bus)); 
                        navigate('/seats'); 
                      }} 
                      disabled={availableSeats === 0}
                      className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                        availableSeats > 0 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {availableSeats > 0 ? 'Select Seats' : 'Fully Booked'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusResultsPage;
