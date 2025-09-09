import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
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
    // Predefined bus data with constant values
    const predefinedBuses = [
      {
        id: 1,
        name: 'KPN Travels AC Sleeper',
        type: 'AC Sleeper',
        price: 950,
        rating: '4.2',
        departureTime: '6:00',
        arrivalTime: '12:30',
        travelHours: '6h 30m'
      },
      {
        id: 2,
        name: 'SRS Travels Non-AC Sleeper',
        type: 'Non-AC Sleeper',
        price: 650,
        rating: '4.0',
        departureTime: '7:30',
        arrivalTime: '14:00',
        travelHours: '6h 30m'
      },
      {
        id: 3,
        name: 'VRL Travels AC Seater',
        type: 'AC Seater',
        price: 750,
        rating: '4.3',
        departureTime: '8:00',
        arrivalTime: '14:30',
        travelHours: '6h 30m'
      },
      {
        id: 4,
        name: 'Orange Tours Non-AC Seater',
        type: 'Non-AC Seater',
        price: 450,
        rating: '3.8',
        departureTime: '9:15',
        arrivalTime: '15:45',
        travelHours: '6h 30m'
      },
      {
        id: 5,
        name: 'KPN Travels Non-AC Seater',
        type: 'Non-AC Seater',
        price: 500,
        rating: '4.1',
        departureTime: '10:00',
        arrivalTime: '16:30',
        travelHours: '6h 30m'
      },
      {
        id: 6,
        name: 'SRS Travels AC Sleeper',
        type: 'AC Sleeper',
        price: 1050,
        rating: '4.4',
        departureTime: '11:30',
        arrivalTime: '18:00',
        travelHours: '6h 30m'
      },
      {
        id: 7,
        name: 'VRL Travels Non-AC Sleeper',
        type: 'Non-AC Sleeper',
        price: 700,
        rating: '4.0',
        departureTime: '13:00',
        arrivalTime: '19:30',
        travelHours: '6h 30m'
      },
      {
        id: 8,
        name: 'Orange Tours AC Seater',
        type: 'AC Seater',
        price: 800,
        rating: '3.9',
        departureTime: '14:45',
        arrivalTime: '21:15',
        travelHours: '6h 30m'
      }
    ];

    const buses = predefinedBuses.map(busData => {
      const seats = [];
      
      // Driver seat (top right)
      seats.push({
        number: 'D1',
        status: 'driver',
        type: 'driver',
        row: 0,
        position: 'driver'
      });
      
      // Different seat layouts for sleeper vs seater buses
      if (busData.type.includes('Sleeper')) {
        // Sleeper layout: 1+2 configuration with upper/lower berths, 5 rows
        // Total seats: 30 (5 rows × 6 berths per row)
        for (let row = 1; row <= 5; row++) {
          // Left side: 1 berth (upper and lower)
          // Upper berth
          const leftUpperNumber = (row - 1) * 6 + 1;
          seats.push({
            number: leftUpperNumber,
            status: 'available',
            type: (row <= 2 && leftUpperNumber <= 2) ? 'ladies' : 'regular',
            row: row,
            position: 'left',
            berth: 'upper',
            berthPosition: 'single'
          });
          
          // Lower berth
          const leftLowerNumber = (row - 1) * 6 + 2;
          seats.push({
            number: leftLowerNumber,
            status: 'available',
            type: (row <= 2 && leftLowerNumber <= 4) ? 'ladies' : 'regular',
            row: row,
            position: 'left',
            berth: 'lower',
            berthPosition: 'single'
          });
          
          // Right side: 2 berths (upper and lower each)
          // First right berth - upper
          const rightFirstUpperNumber = (row - 1) * 6 + 3;
          seats.push({
            number: rightFirstUpperNumber,
            status: 'available',
            type: 'regular',
            row: row,
            position: 'right',
            berth: 'upper',
            berthPosition: 'first'
          });
          
          // First right berth - lower
          const rightFirstLowerNumber = (row - 1) * 6 + 4;
          seats.push({
            number: rightFirstLowerNumber,
            status: 'available',
            type: 'regular',
            row: row,
            position: 'right',
            berth: 'lower',
            berthPosition: 'first'
          });
          
          // Second right berth - upper
          const rightSecondUpperNumber = (row - 1) * 6 + 5;
          seats.push({
            number: rightSecondUpperNumber,
            status: 'available',
            type: 'regular',
            row: row,
            position: 'right',
            berth: 'upper',
            berthPosition: 'second'
          });
          
          // Second right berth - lower
          const rightSecondLowerNumber = (row - 1) * 6 + 6;
          seats.push({
            number: rightSecondLowerNumber,
            status: 'available',
            type: 'regular',
            row: row,
            position: 'right',
            berth: 'lower',
            berthPosition: 'second'
          });
        }
      } else {
        // Seater layout: 2+2 configuration, 10 rows (original layout)
        // Total seats: 40 (10 rows × 4 seats per row)
        for (let row = 1; row <= 10; row++) {
          for (let seatInRow = 1; seatInRow <= 4; seatInRow++) {
            const seatNumber = (row - 1) * 4 + seatInRow;
            // Make seats initially available - server will determine actual booked seats
            const status = 'available';
            // Set some seats as ladies seats (first 2 rows, some seats)
            const seatType = (row <= 2 && (seatNumber === 1 || seatNumber === 2 || seatNumber === 5 || seatNumber === 6)) ? 'ladies' : 'regular';
            
            seats.push({
              number: seatNumber,
              status,
              type: seatType,
              row: row,
              position: seatInRow <= 2 ? 'left' : 'right', // seats 1,2 are left side, 3,4 are right side
              berth: 'none' // Not applicable for seater buses
            });
          }
        }
      }
      
      return {
        ...busData,
        seats
      };
    });
    
    return buses;
  };
  
  return (
    <div className="font-sans">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <HomePage 
              key="home"
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
              key="results"
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
              key="history"
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