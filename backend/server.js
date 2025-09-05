const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bus-booking-system';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  bus: {
    type: String,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  seats: [{
    type: mongoose.Schema.Types.Mixed,
    required: true
  }],
  passengers: [{
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    age: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    }
  }],
  boardingPoint: {
    type: String,
    required: true
  },
  droppingPoint: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Confirmed'
  },
  bookingDate: {
    type: String,
    required: true
  },
  paymentDetails: {
    method: {
      type: String,
      default: 'Card'
    },
    transactionId: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

// Booking Model
const Booking = mongoose.model('Booking', bookingSchema);

// Routes

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bus Booking System API is running!',
    version: '1.0.0',
    status: 'OK'
  });
});

// POST route to create a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      id,
      bus,
      route,
      date,
      time,
      seats,
      passengers,
      boardingPoint,
      droppingPoint,
      amount,
      status,
      bookingDate,
      paymentDetails
    } = req.body;

    // Validate required fields
    if (!id || !bus || !route || !date || !time || !seats || !passengers || !boardingPoint || !droppingPoint || !amount || !bookingDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['id', 'bus', 'route', 'date', 'time', 'seats', 'passengers', 'boardingPoint', 'droppingPoint', 'amount', 'bookingDate']
      });
    }

    // Check if booking with same ID already exists
    const existingBooking = await Booking.findOne({ id });
    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'Booking with this ID already exists'
      });
    }

    // Generate transaction ID if not provided
    const transactionId = paymentDetails?.transactionId || `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

    // Create new booking
    const newBooking = new Booking({
      id,
      bus,
      route,
      date,
      time,
      seats,
      passengers,
      boardingPoint,
      droppingPoint,
      amount,
      status: status || 'Confirmed',
      bookingDate,
      paymentDetails: {
        method: paymentDetails?.method || 'Card',
        transactionId
      }
    });

    // Save to database
    const savedBooking = await newBooking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: savedBooking
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET route to fetch all bookings (for history)
app.get('/api/bookings', async (req, res) => {
  try {
    const { email, phone, bookingId } = req.query;
    
    let filter = {};
    
    // Filter by email if provided
    if (email) {
      filter['passengers.email'] = email;
    }
    
    // Filter by phone if provided
    if (phone) {
      filter['passengers.phone'] = phone;
    }
    
    // Filter by booking ID if provided
    if (bookingId) {
      filter.id = bookingId;
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Bookings fetched successfully',
      count: bookings.length,
      data: bookings
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET route to fetch a specific booking by ID
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findOne({ id });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking fetched successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// PUT route to update booking status
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['Confirmed', 'Cancelled', 'Completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
      });
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { id },
      { status },
      { new: true }
    );
    
    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// DELETE route to cancel a booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedBooking = await Booking.findOneAndUpdate(
      { id },
      { status: 'Cancelled' },
      { new: true }
    );
    
    if (!deletedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: deletedBooking
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET route to fetch booked seats for a specific bus, route, and date
app.get('/api/booked-seats', async (req, res) => {
  try {
    const { bus, route, date } = req.query;
    
    // Validate required parameters
    if (!bus || !route || !date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: bus, route, and date are required',
        received: { bus, route, date }
      });
    }

    // Find all confirmed bookings for the specified bus, route, and date
    const bookings = await Booking.find({
      bus: bus,
      route: route,
      date: date,
      status: 'Confirmed'
    });

    // Extract booked seat numbers from all bookings
    const bookedSeats = [];
    bookings.forEach(booking => {
      if (booking.seats && Array.isArray(booking.seats)) {
        bookedSeats.push(...booking.seats);
      }
    });

    // Remove duplicates and sort
    const uniqueBookedSeats = [...new Set(bookedSeats)].sort((a, b) => {
      // Sort numerically if both are numbers, otherwise sort alphabetically
      if (!isNaN(a) && !isNaN(b)) {
        return parseInt(a) - parseInt(b);
      }
      return a.toString().localeCompare(b.toString());
    });

    res.status(200).json({
      success: true,
      message: 'Booked seats fetched successfully',
      data: {
        bus,
        route,
        date,
        bookedSeats: uniqueBookedSeats,
        totalBookedSeats: uniqueBookedSeats.length
      }
    });

  } catch (error) {
    console.error('Error fetching booked seats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404 for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/bookings`);
});

module.exports = app;
