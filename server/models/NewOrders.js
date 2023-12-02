

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer_id:{
    type: String,
    required: true,
    unique: true,
  },
name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: false,
  },
  location: {
    type: String
  },
  Order: 
    [[{
      id: String,
      name: String,
      price: Number,
      qty: Number,
      size: String,
      img: String, 
      timeplaced:{ type: Date, default: Date.now },
    }]]
  
  
}, {
    // Explicitly set the collection name
    collection: 'NewOrders'
  });

const NewOrders = mongoose.model('NewOrders', orderSchema);

module.exports = NewOrders;
