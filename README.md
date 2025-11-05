# 🚌 BookMySeat

A full-stack web application for booking bus tickets with real-time seat selection, passenger management, and booking history. Built with React, Node.js, Express, and MongoDB.

## ✨ Features

### 🎯 Core Functionality
- **🔍 Bus Search**: Search buses between Tamil Nadu cities with date selection
- **💺 Real-time Seat Selection**: Interactive seat map with live availability
- **👥 Passenger Management**: Add multiple passengers with validation
- **🏢 Boarding Points**: Select pickup and drop-off locations
- **💳 Payment Processing**: Secure payment with transaction tracking
- **📋 Booking History**: View and manage past bookings
- **📱 Responsive Design**: Mobile-friendly interface

### 🛡️ Advanced Features
- **♀️ Ladies Seat Restriction**: Gender-based seat allocation
- **🔄 Real-time Updates**: Live seat availability from server
- **💾 Offline Support**: Local storage backup for bookings
- **🔍 Search & Filter**: Filter bookings by date, phone, email
- **⚡ Auto-refresh**: Automatic seat status updates
- **🎨 Modern UI**: Clean design with Tailwind CSS and Lucide icons

## 🏗️ Architecture

```
bus-ticket-booking-system/
├── frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # React Components
│   │   ├── config/          # API Configuration
│   │   └── assets/          # Static Assets
│   └── public/              # Public Files
├── backend/                 # Node.js + Express Backend
│   ├── server.js            # Main Server File
│   └── package.json         # Dependencies
└── README.md               # This File
```

## 🛠️ Tech Stack

### Frontend
- **⚛️ React 19** - UI Library
- **🛣️ React Router** - Navigation
- **⚡ Vite** - Build Tool
- **🎨 Tailwind CSS** - Styling
- **🎯 Lucide React** - Icons
- **📱 Responsive Design** - Mobile-first approach

### Backend
- **🟢 Node.js** - Runtime Environment
- **🚀 Express.js** - Web Framework
- **🍃 MongoDB** - Database
- **🔗 Mongoose** - ODM
- **🌐 CORS** - Cross-origin requests
- **🔧 dotenv** - Environment management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/joe-anidas/bus-ticket-booking-system.git
cd bus-ticket-booking-system
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB connection string

# Start backend server
npm run dev        # Development with nodemon
# or
npm start          # Production
```

**Backend Environment (.env):**
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bus-booking-system
API_VERSION=v1
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create environment file
cp .env.example .env
# Configure API endpoint

# Start frontend server
npm run dev        # Development
# or
npm run build      # Production build
```

**Frontend Environment (.env):**
```env
VITE_API_BASE_URL=http://localhost:5001
VITE_API_VERSION=v1
VITE_NODE_ENV=development
VITE_APP_NAME=BookMySeat
VITE_APP_VERSION=1.0.0
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **API Health**: http://localhost:5001/

## 📚 API Documentation

### Base URL: `http://localhost:5001/api`

#### 🎫 Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/bookings` | Create new booking |
| `GET` | `/bookings` | Get all bookings |
| `GET` | `/bookings/:id` | Get specific booking |
| `PUT` | `/bookings/:id` | Update booking status |
| `DELETE` | `/bookings/:id` | Cancel booking |

#### 💺 Seat Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/booked-seats?bus={name}&route={route}&date={date}` | Get booked seats |

### Example API Usage

**Create Booking:**
```bash
curl -X POST http://localhost:5001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "id": "1693920000000",
    "bus": "KPN Travels AC Sleeper",
    "route": "Chennai → Coimbatore",
    "date": "2025-09-05",
    "time": "06:00",
    "seats": [1, 2],
    "passengers": [{
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "age": "25",
      "gender": "male"
    }],
    "boardingPoint": "bp1",
    "droppingPoint": "dp1",
    "amount": 2400,
    "bookingDate": "2025-09-05"
  }'
```

## 🗄️ Database Schema

### Booking Model
```javascript
{
  id: String (required, unique),
  bus: String (required),
  route: String (required),
  date: String (required),
  time: String (required),
  seats: [Mixed] (required),
  passengers: [{
    name: String (required),
    email: String (required),
    phone: String (required),
    age: String (required),
    gender: String (required)
  }],
  boardingPoint: String (required),
  droppingPoint: String (required),
  amount: Number (required),
  status: String (default: 'Confirmed'),
  bookingDate: String (required),
  paymentDetails: {
    method: String (default: 'Card'),
    transactionId: String (required)
  },
  timestamps: true
}
```

## 🎯 User Journey

1. **🏠 Home Page**: Search buses between cities
2. **📋 Bus Results**: View available buses with live seat count
3. **💺 Seat Selection**: Choose seats on interactive bus layout
4. **🚏 Boarding Points**: Select pickup/drop locations
5. **👤 Passenger Details**: Enter passenger information
6. **💳 Payment**: Process payment with card details
7. **✅ Success**: Confirmation with booking details
8. **📖 History**: View and manage past bookings

## 🔧 Available Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start with nodemon (development)
npm test           # Run tests (placeholder)
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## 🌟 Key Components

### Frontend Components
- **HomePage**: Search interface with city selection
- **BusResultsPage**: Display available buses with filters
- **SeatSelectionPage**: Interactive seat map
- **BoardingPointsPage**: Pickup/drop point selection
- **PassengerDetailsPage**: Passenger information form
- **PaymentPage**: Payment processing interface
- **SuccessPage**: Booking confirmation
- **HistoryPage**: Booking history with search

### Backend Features
- **RESTful API**: Clean endpoint structure
- **MongoDB Integration**: Persistent data storage
- **Real-time Updates**: Live seat availability
- **Error Handling**: Comprehensive error responses
- **CORS Support**: Frontend-backend communication
- **Environment Config**: Flexible configuration

## 🔒 Security Features

- **Input Validation**: Server-side validation for all inputs
- **Gender-based Restrictions**: Ladies seat allocation
- **Duplicate Prevention**: Unique booking ID validation
- **Error Handling**: Secure error messages
- **CORS Configuration**: Controlled cross-origin requests

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
# Set environment variables
PORT=5001
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
```

### MongoDB (Atlas)
1. Create MongoDB Atlas account
2. Create cluster and database
3. Get connection string
4. Update `MONGODB_URI` in environment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow React best practices
- Use TypeScript for new features
- Add tests for critical functionality
- Update documentation for new features
- Follow existing code style

## 📝 License

This project is licensed under the ISC License - see the package.json files for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check API documentation
- Review environment configuration

## 🎯 Future Enhancements

- [ ] **🔐 User Authentication**: Login/Register system
- [ ] **📧 Email Notifications**: Booking confirmations
- [ ] **📱 Mobile App**: React Native version
- [ ] **💰 Multiple Payment**: UPI, wallet integration
- [ ] **📊 Analytics**: Booking analytics dashboard
- [ ] **🎫 QR Tickets**: Digital ticket generation
- [ ] **🔔 Notifications**: Real-time booking updates
- [ ] **🗺️ Route Maps**: Visual route information

---

**Built with ❤️ by Joe Anidas**

*Happy Coding! 🚀*
