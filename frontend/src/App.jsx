import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import BusResultsPage from './components/BusResultsPage';
import SeatSelectionPage from './components/SeatSelectionPage';
import BoardingPointsPage from './components/BoardingPointsPage';
import PassengerDetailsPage from './components/PassengerDetailsPage';
import PaymentPage from './components/PaymentPage';
import SuccessPage from './components/SuccessPage';
import HistoryPage from './components/HistoryPage';
import './App.css';

const AppContent = () => {
  const navigate = useNavigate();
  
  // State management
  const [searchData, setSearchData] = useState({
    from: 'Chennai',
    to: 'Coimbatore',
    date: new Date().toLocaleDateString('en-CA'), // Today's date in YYYY-MM-DD format
    passengers: 1
  });
  
  const [availableBuses, setAvailableBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState('bp1');
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState('dp1');
  const [passengerDetails, setPassengerDetails] = useState([
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '9876543210',
      age: '25',
      gender: 'male'
    }
  ]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [error, setError] = useState('');
  
  // Cities data
  const cities = [
    'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli',
    'Erode', 'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Karur',
    'Cuddalore', 'Kanchipuram', 'Tiruvannamalai', 'Nagapattinam'
  ];
  
  // Generate buses function
  const generateBuses = (from, to) => {
    const busTypes = ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Non-AC Seater'];
    const companies = ['KPN Travels', 'SRS Travels', 'VRL Travels', 'Orange Tours'];
    const buses = [];
    
    for (let i = 0; i < 8; i++) {
      const type = busTypes[Math.floor(Math.random() * busTypes.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const basePrice = type.includes('AC') ? 800 : 500;
      const price = basePrice + Math.floor(Math.random() * 300);
      
      // Generate seats - 1 driver seat + 40 passenger seats (10 rows of 4)
      const seats = [];
      
      // Driver seat (top right)
      seats.push({
        number: 'D1',
        status: 'driver',
        type: 'driver',
        row: 0,
        position: 'driver'
      });
      
      // Passenger seats - 10 rows of 4 seats each (2-2 layout)
      for (let row = 1; row <= 10; row++) {
        for (let seatInRow = 1; seatInRow <= 4; seatInRow++) {
          const seatNumber = (row - 1) * 4 + seatInRow;
          const status = Math.random() > 0.7 ? 'booked' : 'available';
          const seatType = row <= 2 && Math.random() > 0.7 ? 'ladies' : 'regular';
          
          seats.push({
            number: seatNumber,
            status,
            type: seatType,
            row: row,
            position: seatInRow <= 2 ? 'left' : 'right' // seats 1,2 are left side, 3,4 are right side
          });
        }
      }
      
      buses.push({
        id: i + 1,
        name: `${company} ${type}`,
        type,
        price,
        rating: (3.5 + Math.random() * 1.5).toFixed(1),
        departureTime: `${6 + i}:${Math.random() > 0.5 ? '00' : '30'}`,
        arrivalTime: `${12 + i}:${Math.random() > 0.5 ? '00' : '30'}`,
        travelHours: `${5 + Math.floor(Math.random() * 3)}h ${Math.floor(Math.random() * 60)}m`,
        seats
      });
    }
    
    return buses;
  };
  
  return (
    <div className="font-sans">
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              searchData={searchData}
              setSearchData={setSearchData}
              setAvailableBuses={setAvailableBuses}
              cities={cities}
              generateBuses={generateBuses}
              setError={setError}
              error={error}
              navigate={navigate}
            />
          } 
        />
        <Route 
          path="/results" 
          element={
            <BusResultsPage 
              searchData={searchData}
              setSearchData={setSearchData}
              availableBuses={availableBuses}
              setAvailableBuses={setAvailableBuses}
              setSelectedBus={setSelectedBus}
              navigate={navigate}
            />
          } 
        />
        <Route 
          path="/seats" 
          element={
            <SeatSelectionPage 
              searchData={searchData}
              setSearchData={setSearchData}
              availableBuses={availableBuses}
              setAvailableBuses={setAvailableBuses}
              selectedBus={selectedBus}
              setSelectedBus={setSelectedBus}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              navigate={navigate}
            />
          } 
        />
        <Route 
          path="/boarding" 
          element={
            <BoardingPointsPage 
              searchData={searchData}
              setSearchData={setSearchData}
              selectedBus={selectedBus}
              setSelectedBus={setSelectedBus}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              selectedBoardingPoint={selectedBoardingPoint}
              setSelectedBoardingPoint={setSelectedBoardingPoint}
              selectedDroppingPoint={selectedDroppingPoint}
              setSelectedDroppingPoint={setSelectedDroppingPoint}
              navigate={navigate}
            />
          } 
        />
        <Route 
          path="/passenger" 
          element={
            <PassengerDetailsPage 
              searchData={searchData}
              setSearchData={setSearchData}
              selectedBus={selectedBus}
              setSelectedBus={setSelectedBus}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              selectedBoardingPoint={selectedBoardingPoint}
              setSelectedBoardingPoint={setSelectedBoardingPoint}
              selectedDroppingPoint={selectedDroppingPoint}
              setSelectedDroppingPoint={setSelectedDroppingPoint}
              passengerDetails={passengerDetails}
              setPassengerDetails={setPassengerDetails}
              navigate={navigate}
            />
          } 
        />
        <Route 
          path="/payment" 
          element={
            <PaymentPage 
              searchData={searchData}
              setSearchData={setSearchData}
              selectedBus={selectedBus}
              setSelectedBus={setSelectedBus}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              selectedBoardingPoint={selectedBoardingPoint}
              setSelectedBoardingPoint={setSelectedBoardingPoint}
              selectedDroppingPoint={selectedDroppingPoint}
              setSelectedDroppingPoint={setSelectedDroppingPoint}
              passengerDetails={passengerDetails}
              setPassengerDetails={setPassengerDetails}
              bookingHistory={bookingHistory}
              setBookingHistory={setBookingHistory}
              navigate={navigate}
            />
          } 
        />
        <Route 
          path="/success" 
          element={
            <SuccessPage 
              bookingHistory={bookingHistory}
              navigate={navigate}
            />
          } 
        />
        <Route 
          path="/history" 
          element={
            <HistoryPage 
              bookingHistory={bookingHistory}
              navigate={navigate}
            />
          } 
        />
      </Routes>
    </div>
  );
};

const BusBookingSystem = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default BusBookingSystem;