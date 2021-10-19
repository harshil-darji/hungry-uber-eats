const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
  emailId: {
    type: String,
    required: true,
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
});

module.exports = mongoose.model('Customer', CustomerSchema);
