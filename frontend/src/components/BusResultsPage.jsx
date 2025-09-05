import React, { useEffect } from 'react';
import { Bus, ArrowLeft, Star } from 'lucide-react';


const BusResultsPage = ({ searchData, setSearchData, availableBuses, setAvailableBuses, setSelectedBus, navigate }) => {
  useEffect(() => {
    const savedSearchData = localStorage.getItem('searchData');
    const savedBuses = localStorage.getItem('availableBuses');
    if (savedSearchData) setSearchData(JSON.parse(savedSearchData));
    if (savedBuses) setAvailableBuses(JSON.parse(savedBuses));
  }, []);
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
          <div></div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto p-4">
        <h3 className="text-2xl font-bold mb-6">Available Buses ({availableBuses.length})</h3>
        {availableBuses.length === 0 ? (
          <div className="text-center py-12">
            <Bus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-600 mb-2">No Buses Found</h4>
            <p className="text-gray-500">Try adjusting your search criteria or date</p>
            <button onClick={() => navigate('/')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Back to Search</button>
          </div>
        ) : (
          <div className="space-y-4">
            {availableBuses.map((bus) => (
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
                  <p className="text-sm text-green-600">{bus.seats.filter(seat => seat.status === 'available').length} seats available</p>
                  <button onClick={() => { setSelectedBus(bus); localStorage.setItem('selectedBus', JSON.stringify(bus)); navigate('/seats'); }} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Select Seats</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusResultsPage;
