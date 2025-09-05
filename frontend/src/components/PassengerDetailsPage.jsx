import React, { useEffect } from 'react';
import { ArrowLeft, User } from 'lucide-react';


const PassengerDetailsPage = ({ searchData, setSearchData, selectedBus, setSelectedBus, selectedSeats, setSelectedSeats, selectedBoardingPoint, setSelectedBoardingPoint, selectedDroppingPoint, setSelectedDroppingPoint, passengerDetails, setPassengerDetails, navigate }) => {
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

  // Initialize passenger details array based on selected seats
  useEffect(() => {
    if (selectedSeats && selectedSeats.length > 0) {
      const currentPassengers = passengerDetails.length;
      const requiredPassengers = selectedSeats.length;
      
      if (currentPassengers < requiredPassengers) {
        // Add more passenger forms
        const newPassengers = [...passengerDetails];
        for (let i = currentPassengers; i < requiredPassengers; i++) {
          newPassengers.push({
            name: `Passenger ${i + 1}`,
            email: `passenger${i + 1}@example.com`,
            phone: `987654321${i}`,
            age: `${25 + i}`,
            gender: i % 2 === 0 ? 'male' : 'female'
          });
        }
        setPassengerDetails(newPassengers);
      } else if (currentPassengers > requiredPassengers) {
        // Remove excess passenger forms
        setPassengerDetails(passengerDetails.slice(0, requiredPassengers));
      }
    }
  }, [selectedSeats]);

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengerDetails];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setPassengerDetails(updatedPassengers);
  };

  const handleNext = () => {
    // Validate all passenger details
    for (let i = 0; i < passengerDetails.length; i++) {
      const passenger = passengerDetails[i];
      if (!passenger.name || !passenger.email || !passenger.phone || !passenger.age || !passenger.gender) {
        alert(`Please fill in all details for Passenger ${i + 1}`);
        return;
      }
    }
    localStorage.setItem('passengerDetails', JSON.stringify(passengerDetails));
    navigate('/payment');
  };
  
  const totalPrice = selectedSeats.length * (selectedBus?.price || 0);

  return (
    <div className="min-h-screen bg-gray-50 passenger-details-page">
      <header className="bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/boarding')} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Boarding Points</span>
          </button>
          <h2 className="text-xl font-semibold">Passenger Details</h2>
          <div></div>
        </div>
      </header>
      
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold mb-6">Enter Passenger Information</h3>
              
              {/* Multiple Passenger Forms */}
              {passengerDetails.map((passenger, index) => {
                const seatNumber = selectedSeats[index];
                return (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="w-5 h-5 text-blue-600" />
                      <h4 className="text-lg font-semibold text-gray-800">
                        Passenger {index + 1} - Seat {seatNumber}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input 
                          type="text" 
                          value={passenger.name} 
                          onChange={e => handlePassengerChange(index, 'name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          required 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input 
                          type="email" 
                          value={passenger.email} 
                          onChange={e => handlePassengerChange(index, 'email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          required 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input 
                          type="tel" 
                          value={passenger.phone} 
                          onChange={e => handlePassengerChange(index, 'phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          required 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        <input 
                          type="number" 
                          value={passenger.age} 
                          onChange={e => handlePassengerChange(index, 'age', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          required 
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select 
                          value={passenger.gender} 
                          onChange={e => handlePassengerChange(index, 'gender', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
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
              <button 
                type="button" 
                onClick={handleNext} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Next: Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetailsPage;
