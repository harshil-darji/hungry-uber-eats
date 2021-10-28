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
  rating: {
    type: Number,
  },
  restImages: [{ imageLink: { type: String } }],
  restType: [String],
  dishes: [
    {
      name: {
        type: String,
        required: true,
      },
      dishPrice: {
        type: Number,
        required: true,
      },
      ingreds: {
        type: String,
      },
      description: {
        type: String,
      },
      dishType: {
        type: String,
        enum: ['Appetizer', 'Salad', 'Main course', 'Dessert', 'Beverage'],
      },
      category: {
        type: String,
        enum: ['Veg', 'Non-veg', 'Vegan'],
      },
      dishImages: [{ imageLink: { type: String } }],
    },
  ],
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
