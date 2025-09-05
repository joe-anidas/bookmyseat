import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const SeatSelectionPage = ({ searchData, setSearchData, availableBuses, setAvailableBuses, selectedBus, setSelectedBus, selectedSeats, setSelectedSeats, navigate }) => {
  const [loading, setLoading] = useState(false);
  const [bookedSeatsFromServer, setBookedSeatsFromServer] = useState([]);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const savedSearchData = localStorage.getItem('searchData');
    const savedBuses = localStorage.getItem('availableBuses');
    const savedSelectedBus = localStorage.getItem('selectedBus');
    if (savedSearchData) setSearchData(JSON.parse(savedSearchData));
    if (savedBuses) setAvailableBuses(JSON.parse(savedBuses));
    if (savedSelectedBus) setSelectedBus(JSON.parse(savedSelectedBus));
    const savedSelectedSeats = localStorage.getItem('selectedSeats');
    if (savedSelectedSeats) setSelectedSeats(JSON.parse(savedSelectedSeats));
  }, []);

  // Fetch booked seats from server
  const fetchBookedSeats = async () => {
    if (!selectedBus || !searchData) return;
    
    setLoading(true);
    setFetchError('');
    try {
      const route = `${searchData.from} → ${searchData.to}`;
      const response = await fetch(
        `http://localhost:5001/api/booked-seats?bus=${encodeURIComponent(selectedBus.name)}&route=${encodeURIComponent(route)}&date=${encodeURIComponent(searchData.date)}`
      );
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setBookedSeatsFromServer(result.data.bookedSeats);
          
          // Update the selected bus seats to reflect booked seats from server
          const updatedBus = { ...selectedBus };
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
          
          setSelectedBus(updatedBus);
          
          // Update available buses list as well
          const updatedBuses = availableBuses.map(bus => 
            bus.id === selectedBus.id ? updatedBus : bus
          );
          setAvailableBuses(updatedBuses);
          
          // Save updated data to localStorage
          localStorage.setItem('selectedBus', JSON.stringify(updatedBus));
          localStorage.setItem('availableBuses', JSON.stringify(updatedBuses));
        } else {
          setFetchError('Failed to fetch seat availability');
        }
      } else {
        setFetchError('Unable to connect to server. Showing cached seat data.');
        console.error('Failed to fetch booked seats:', response.statusText);
      }
    } catch (error) {
      setFetchError('Network error. Showing cached seat data.');
      console.error('Error fetching booked seats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch booked seats when component mounts and when selectedBus changes
  useEffect(() => {
    if (selectedBus && searchData) {
      fetchBookedSeats();
    }
  }, [selectedBus?.id, searchData?.date, searchData?.from, searchData?.to]);

  if (!selectedBus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Bus Selected</h2>
          <p className="text-gray-600 mb-6">Please go back and select a bus first.</p>
          <button onClick={() => navigate('/results')} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">Back to Bus Results</button>
        </div>
      </div>
    );
  }

  const toggleSeat = (seatNumber) => {
    const seat = selectedBus.seats.find(s => s.number === seatNumber);
    if (seat.status !== 'available' || seat.type === 'driver') return;
    let newSelectedSeats;
    if (selectedSeats.includes(seatNumber)) {
      // Remove seat if already selected
      newSelectedSeats = selectedSeats.filter(id => id !== seatNumber);
    } else {
      // Add seat to selection (no limit)
      newSelectedSeats = [...selectedSeats, seatNumber];
    }
    setSelectedSeats(newSelectedSeats);
    localStorage.setItem('selectedSeats', JSON.stringify(newSelectedSeats));
  };

  const totalPrice = selectedSeats.length * selectedBus.price;

  return (
    <div className="min-h-screen bg-gray-50 seat-selection-page">
      <header className="bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/results')} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Buses</span>
          </button>
          <div className="text-center">
            <h2 className="text-xl font-semibold">{selectedBus.name}</h2>
            <p className="text-gray-600">{searchData.from} → {searchData.to}</p>
          </div>
          <div></div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Select Your Seats</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={fetchBookedSeats}
                    disabled={loading}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Refresh
                  </button>
                  {loading && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Fetching latest seat availability...</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-6 mb-6 text-sm">
                <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-green-500 rounded"></div><span>Available</span></div>
                <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-red-500 rounded"></div><span>Booked</span></div>
                <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-pink-500 rounded"></div><span>Ladies</span></div>
                <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-blue-500 rounded"></div><span>Selected</span></div>
                <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-gray-500 rounded"></div><span>Driver</span></div>
              </div>
              
              {fetchError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Warning:</strong> {fetchError}
                  </p>
                </div>
              )}
              
              {bookedSeatsFromServer.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Seats {bookedSeatsFromServer.join(', ')} are already booked by other passengers.
                  </p>
                </div>
              )}
              
              {/* Bus Layout */}
              <div className="bg-gray-100 rounded-xl p-6 max-w-md mx-auto">
                {/* Driver Area */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-gray-300">
                  <div className="text-sm text-gray-600 font-medium">Driver</div>
                  <div className="flex justify-end">
                    {selectedBus.seats.filter(seat => seat.type === 'driver').map((seat) => (
                      <div key={seat.number} className="w-8 h-8 rounded bg-gray-500 text-white flex items-center justify-center text-xs font-medium">
                        D
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Passenger Seats */}
                {selectedBus.type.includes('Sleeper') ? (
                  /* Sleeper Layout - 1+2 configuration with upper/lower berths, 5 rows */
                  <div className="space-y-4">
                    <div className="text-xs text-gray-600 text-center mb-2">Upper (U) / Lower (L) Berths</div>
                    {[...Array(5)].map((_, rowIndex) => {
                      const rowNumber = rowIndex + 1;
                      const rowSeats = selectedBus.seats.filter(seat => seat.row === rowNumber);
                      const leftSeats = rowSeats.filter(seat => seat.position === 'left');
                      const rightSeats = rowSeats.filter(seat => seat.position === 'right');
                      
                      return (
                        <div key={rowNumber} className="flex justify-between items-center">
                          {/* Left side - Single berth (upper and lower) */}
                          <div className="flex flex-col space-y-1">
                            {leftSeats.map((seat) => {
                              const isSelected = selectedSeats.includes(seat.number);
                              let seatClass = 'w-12 h-6 rounded border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-all ';
                              
                              if (seat.status === 'booked') {
                                seatClass += 'bg-red-500 text-white border-red-500 cursor-not-allowed';
                              } else if (seat.type === 'ladies') {
                                seatClass += isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-pink-200 text-pink-800 border-pink-300 hover:bg-pink-300';
                              } else if (isSelected) {
                                seatClass += 'bg-blue-500 text-white border-blue-500';
                              } else {
                                seatClass += 'bg-green-200 text-green-800 border-green-300 hover:bg-green-300';
                              }
                              
                              return (
                                <button 
                                  key={seat.number} 
                                  className={seatClass} 
                                  onClick={() => toggleSeat(seat.number)} 
                                  disabled={seat.status === 'booked'}
                                  title={`${seat.berth} berth`}
                                >
                                  {seat.number}{seat.berth === 'upper' ? 'U' : 'L'}
                                </button>
                              );
                            })}
                          </div>
                          
                          {/* Row number */}
                          <div className="w-6 flex justify-center">
                            <div className="text-xs text-gray-400">{rowNumber}</div>
                          </div>
                          
                          {/* Right side - Two berths (upper and lower each) */}
                          <div className="flex space-x-2">
                            {/* First right berth */}
                            <div className="flex flex-col space-y-1">
                              {rightSeats.filter(seat => seat.berthPosition === 'first').map((seat) => {
                                const isSelected = selectedSeats.includes(seat.number);
                                let seatClass = 'w-12 h-6 rounded border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-all ';
                                
                                if (seat.status === 'booked') {
                                  seatClass += 'bg-red-500 text-white border-red-500 cursor-not-allowed';
                                } else if (seat.type === 'ladies') {
                                  seatClass += isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-pink-200 text-pink-800 border-pink-300 hover:bg-pink-300';
                                } else if (isSelected) {
                                  seatClass += 'bg-blue-500 text-white border-blue-500';
                                } else {
                                  seatClass += 'bg-green-200 text-green-800 border-green-300 hover:bg-green-300';
                                }
                                
                                return (
                                  <button 
                                    key={seat.number} 
                                    className={seatClass} 
                                    onClick={() => toggleSeat(seat.number)} 
                                    disabled={seat.status === 'booked'}
                                    title={`${seat.berth} berth`}
                                  >
                                    {seat.number}{seat.berth === 'upper' ? 'U' : 'L'}
                                  </button>
                                );
                              })}
                            </div>
                            
                            {/* Second right berth */}
                            <div className="flex flex-col space-y-1">
                              {rightSeats.filter(seat => seat.berthPosition === 'second').map((seat) => {
                                const isSelected = selectedSeats.includes(seat.number);
                                let seatClass = 'w-12 h-6 rounded border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-all ';
                                
                                if (seat.status === 'booked') {
                                  seatClass += 'bg-red-500 text-white border-red-500 cursor-not-allowed';
                                } else if (seat.type === 'ladies') {
                                  seatClass += isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-pink-200 text-pink-800 border-pink-300 hover:bg-pink-300';
                                } else if (isSelected) {
                                  seatClass += 'bg-blue-500 text-white border-blue-500';
                                } else {
                                  seatClass += 'bg-green-200 text-green-800 border-green-300 hover:bg-green-300';
                                }
                                
                                return (
                                  <button 
                                    key={seat.number} 
                                    className={seatClass} 
                                    onClick={() => toggleSeat(seat.number)} 
                                    disabled={seat.status === 'booked'}
                                    title={`${seat.berth} berth`}
                                  >
                                    {seat.number}{seat.berth === 'upper' ? 'U' : 'L'}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Seater Layout - 2+2 configuration, 10 rows */
                  <div className="space-y-3">
                    {[...Array(10)].map((_, rowIndex) => {
                      const rowNumber = rowIndex + 1;
                      const rowSeats = selectedBus.seats.filter(seat => seat.row === rowNumber);
                      const leftSeats = rowSeats.filter(seat => seat.position === 'left');
                      const rightSeats = rowSeats.filter(seat => seat.position === 'right');
                      
                      return (
                        <div key={rowNumber} className="flex justify-between items-center">
                          {/* Left side seats (2 seats) */}
                          <div className="flex space-x-1">
                            {leftSeats.map((seat) => {
                              const isSelected = selectedSeats.includes(seat.number);
                              let seatClass = 'w-10 h-10 rounded border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-all ';
                              
                              if (seat.status === 'booked') {
                                seatClass += 'bg-red-500 text-white border-red-500 cursor-not-allowed';
                              } else if (seat.type === 'ladies') {
                                seatClass += isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-pink-200 text-pink-800 border-pink-300 hover:bg-pink-300';
                              } else if (isSelected) {
                                seatClass += 'bg-blue-500 text-white border-blue-500';
                              } else {
                                seatClass += 'bg-green-200 text-green-800 border-green-300 hover:bg-green-300';
                              }
                              
                              return (
                                <button 
                                  key={seat.number} 
                                  className={seatClass} 
                                  onClick={() => toggleSeat(seat.number)} 
                                  disabled={seat.status === 'booked'}
                                >
                                  {seat.number}
                                </button>
                              );
                            })}
                          </div>
                          
                          {/* Aisle gap */}
                          <div className="w-4 flex justify-center">
                            <div className="text-xs text-gray-400">{rowNumber}</div>
                          </div>
                          
                          {/* Right side seats (2 seats) */}
                          <div className="flex space-x-1">
                            {rightSeats.map((seat) => {
                              const isSelected = selectedSeats.includes(seat.number);
                              let seatClass = 'w-10 h-10 rounded border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-all ';
                              
                              if (seat.status === 'booked') {
                                seatClass += 'bg-red-500 text-white border-red-500 cursor-not-allowed';
                              } else if (seat.type === 'ladies') {
                                seatClass += isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-pink-200 text-pink-800 border-pink-300 hover:bg-pink-300';
                              } else if (isSelected) {
                                seatClass += 'bg-blue-500 text-white border-blue-500';
                              } else {
                                seatClass += 'bg-green-200 text-green-800 border-green-300 hover:bg-green-300';
                              }
                              
                              return (
                                <button 
                                  key={seat.number} 
                                  className={seatClass} 
                                  onClick={() => toggleSeat(seat.number)} 
                                  disabled={seat.status === 'booked'}
                                >
                                  {seat.number}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between"><span className="text-gray-600">Bus:</span><span className="font-medium">{selectedBus.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Date:</span><span className="font-medium">{searchData.date}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Time:</span><span className="font-medium">{selectedBus.departureTime}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Selected Seats:</span><span className="font-medium">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Passengers:</span><span className="font-medium">{selectedSeats.length}</span></div>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold"><span>Total Amount:</span><span className="text-blue-600">₹{totalPrice}</span></div>
              </div>
              <button onClick={() => { if (selectedSeats.length > 0) { navigate('/boarding'); } }} disabled={selectedSeats.length === 0} className={`w-full py-3 rounded-lg font-medium transition-all ${selectedSeats.length > 0 ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Next: Boarding Points</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
