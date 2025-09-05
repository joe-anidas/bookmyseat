# Bus Booking System Backend

A Node.js backend server with Express and MongoDB for managing bus ticket bookings.

## Features

- **Create Bookings**: POST booking details to MongoDB
- **Fetch Bookings**: GET booking history from database
- **Update Bookings**: PUT to update booking status
- **Cancel Bookings**: DELETE to cancel bookings
- **CORS Support**: Frontend-backend communication
- **Error Handling**: Comprehensive error responses

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB connection string
```

3. Start the server:
```bash
npm start          # Production
npm run dev        # Development (with nodemon)
```

## API Endpoints

### Base URL: `http://localhost:5001/api`

### 1. Create Booking
**POST** `/bookings`

Create a new bus booking.

**Request Body:**
```json
{
  "id": "1693920000000",
  "bus": "KPN Travels AC Sleeper",
  "route": "Chennai → Coimbatore",
  "date": "2025-09-05",
  "time": "06:00",
  "seats": [1, 2, 3],
  "passengers": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "age": "25",
      "gender": "male"
    }
  ],
  "boardingPoint": "bp1",
  "droppingPoint": "dp1",
  "amount": 2400,
  "status": "Confirmed",
  "bookingDate": "2025-09-05",
  "paymentDetails": {
    "method": "Card",
    "transactionId": "TXN1693920000000abc"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": { ... }
}
```

### 2. Get All Bookings
**GET** `/bookings`

Fetch all bookings with optional filters.

**Query Parameters:**
- `email`: Filter by passenger email
- `phone`: Filter by passenger phone
- `bookingId`: Filter by booking ID

**Example:**
```
GET /api/bookings?email=john@example.com
```

**Response:**
```json
{
  "success": true,
  "message": "Bookings fetched successfully",
  "count": 5,
  "data": [...]
}
```

### 3. Get Specific Booking
**GET** `/bookings/:id`

Fetch a specific booking by ID.

**Response:**
```json
{
  "success": true,
  "message": "Booking fetched successfully",
  "data": { ... }
}
```

### 4. Update Booking Status
**PUT** `/bookings/:id`

Update booking status.

**Request Body:**
```json
{
  "status": "Cancelled"
}
```

**Valid Statuses:** `Confirmed`, `Cancelled`, `Completed`

### 5. Cancel Booking
**DELETE** `/bookings/:id`

Cancel a booking (sets status to 'Cancelled').

## Database Schema

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

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (dev mode only)"
}
```

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `409`: Conflict (duplicate booking)
- `500`: Internal Server Error

## Environment Variables

```bash
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bus-booking-system
```

## Frontend Integration

The frontend automatically:
1. Sends booking data to `/api/bookings` on payment
2. Fetches booking history from `/api/bookings` 
3. Handles both server and local bookings
4. Shows loading states and error messages

## Development

```bash
npm run dev    # Start with nodemon for auto-reload
npm start      # Start production server
```

## MongoDB Setup

### Local MongoDB:
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod

# Database will be created automatically
```

### MongoDB Atlas (Cloud):
1. Create account at mongodb.com
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in .env

## Notes

- Server runs on port 5001 (configurable)
- CORS enabled for frontend communication
- Automatic transaction ID generation
- Duplicate booking prevention
- Comprehensive error handling
- Backward compatibility with local bookings
