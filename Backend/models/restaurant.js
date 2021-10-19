const mongoose = require('mongoose');

const RestaurantSchema = mongoose.Schema({
  emailId: {
    type: String,
    required: true,
    unique: true,
  },
  passwd: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  address: {
    type: String,
  },
  description: {
    type: String,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  deliveryType: {
    type: String,
    enum: ['Pickup', 'Delivery', 'Both'],
  },
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
