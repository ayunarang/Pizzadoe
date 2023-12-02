

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, default: 'user' },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String
  },
  cartItem: [
    {
      id: String,
      name: String,
      price: Number,
      qty: Number,
      size: String,
      img: String,
      timeAdded: { type: Date, default: Date.now },
    }
  ],
  PlacedOrders: [
    [{
      id: String,
      name: String,
      price: Number,
      qty: Number,
      size: String,
      img: String, 
      Status: { type: String, default: 'ordered' },
    }
  ]
  ],
  otp: {
    type: Number,
    unique: true,
  }

  ,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
