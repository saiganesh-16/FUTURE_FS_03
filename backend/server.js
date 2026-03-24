const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { Reservation, Order } = require('./models');

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.error('🚨 MongoDB Connection Error:', err));

// --- API ROUTES ---

// 1. Catch new Table Reservations
app.post('/api/reservations', async (req, res) => {
  try {
    const newReservation = new Reservation(req.body);
    await newReservation.save();
    res.status(201).json({ message: 'Table Reserved Successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save reservation.' });
  }
});

// 2. Catch new Food Orders
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: 'Order Placed Successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save order.' });
  }
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Aura Bistro Backend is ALIVE on port ${PORT}`);
});