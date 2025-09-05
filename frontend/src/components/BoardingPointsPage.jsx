import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const BoardingPointsPage = ({ searchData, setSearchData, selectedBus, setSelectedBus, selectedSeats, setSelectedSeats, selectedBoardingPoint, setSelectedBoardingPoint, selectedDroppingPoint, setSelectedDroppingPoint, navigate }) => {
  useEffect(() => {
    const savedSearchData = localStorage.getItem('searchData');
    const savedSelectedBus = localStorage.getItem('selectedBus');
    const savedSelectedSeats = localStorage.getItem('selectedSeats');
    if (savedSearchData) setSearchData(JSON.parse(savedSearchData));
    if (savedSelectedBus) setSelectedBus(JSON.parse(savedSelectedBus));
    if (savedSelectedSeats) setSelectedSeats(JSON.parse(savedSelectedSeats));
  }, []);
  const handleNext = () => {
    if (!selectedBoardingPoint || !selectedDroppingPoint) {
      alert('Please select both boarding and dropping points');
      return;
    }
    localStorage.setItem('selectedBoardingPoint', selectedBoardingPoint);
    localStorage.setItem('selectedDroppingPoint', selectedDroppingPoint);
    navigate('/passenger');
  };
  
  const totalPrice = selectedSeats.length * (selectedBus?.price || 0);
  return (
    <div className="min-h-screen bg-gray-50 boarding-points-page">
      <header className="bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/seats')} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Seats</span>
          </button>
          <h2 className="text-xl font-semibold">Boarding & Dropping Points</h2>
          <div></div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Select Boarding Point</h3>
                <div className="space-y-3">
                  {[
                    {id: 'bp1', name: 'Central Bus Stand', time: '15 mins before departure'},
                    {id: 'bp2', name: 'Airport Bus Stop', time: '20 mins before departure'},
                    {id: 'bp3', name: 'Railway Station', time: '10 mins before departure'},
                    {id: 'bp4', name: 'City Center', time: '25 mins before departure'}
                  ].map((point) => (
                    <label key={point.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="boarding" value={point.id} checked={selectedBoardingPoint === point.id} onChange={e => setSelectedBoardingPoint(e.target.value)} className="text-blue-600" />
                      <div>
                        <p className="font-medium">{point.name}</p>
                        <p className="text-sm text-gray-600">{point.time}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Select Dropping Point</h3>
                <div className="space-y-3">
                  {[
                    {id: 'dp1', name: 'Central Bus Stand', time: 'On arrival'},
                    {id: 'dp2', name: 'Airport Bus Stop', time: '5 mins after arrival'},
                    {id: 'dp3', name: 'Railway Station', time: '10 mins after arrival'},
                    {id: 'dp4', name: 'City Center', time: '15 mins after arrival'}
                  ].map((point) => (
                    <label key={point.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="dropping" value={point.id} checked={selectedDroppingPoint === point.id} onChange={e => setSelectedDroppingPoint(e.target.value)} className="text-blue-600" />
                      <div>
                        <p className="font-medium">{point.name}</p>
                        <p className="text-sm text-gray-600">{point.time}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between"><span className="text-gray-600">Bus:</span><span className="font-medium">{selectedBus?.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Route:</span><span className="font-medium">{searchData.from} → {searchData.to}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Date:</span><span className="font-medium">{searchData.date}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Time:</span><span className="font-medium">{selectedBus?.departureTime}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Selected Seats:</span><span className="font-medium">{selectedSeats?.length > 0 ? selectedSeats.join(', ') : 'None'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Passengers:</span><span className="font-medium">{selectedSeats?.length || 0}</span></div>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold"><span>Total Amount:</span><span className="text-blue-600">₹{totalPrice}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <button onClick={handleNext} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">Next: Passenger Details</button>
        </div>
      </div>
    </div>
  );
};

export default BoardingPointsPage;
