const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
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
    required: true,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  about: {
    type: String,
  },
  profileImg: {
    type: String,
  },
  nickName: {
    type: String,
  },
  dob: {
    type: Date,
  },
  addresses: [
    { address: { type: String, unique: true }, city: { type: String } },
  ],
  favouriteRestaurants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  ],
});

module.exports = mongoose.model('Customer', CustomerSchema);
