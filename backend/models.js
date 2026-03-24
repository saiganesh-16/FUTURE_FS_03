const mongoose = require('mongoose');

// 1. Table Reservation Blueprint
const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  timeSlot: { type: String, required: true },
  guests: { type: String, required: true },
  status: { type: String, default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
});

// 2. Food Order Blueprint
const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  cartItems: [
    {
      title: String,
      price: Number,
      qty: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  orderStatus: { type: String, default: 'Preparing' }, // Preparing, Out for Delivery, Delivered
  orderedAt: { type: Date, default: Date.now }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = { Reservation, Order };