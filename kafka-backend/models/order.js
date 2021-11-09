const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  custId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  restId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  dishes: [
    {
      dishDetails: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
        name: { type: String },
        dishPrice: { type: Number },
        ingreds: { type: String },
        description: { type: String },
        category: { type: String },
        dishImages: [],
        dishQuantity: { type: Number },
        totalDishPrice: { type: Number },
      },
    },
  ],
  orderType: {
    type: String,
    enum: ['Delivery', 'Pickup'],
  },
  orderStatus: {
    type: String,
    enum: [
      'Initialized',
      'Placed',
      'Preparing',
      'Ready',
      'On the way',
      'Delivered',
      'Picked up',
      'Cancelled',
    ],
  },
  price: {
    type: Number,
  },
  taxPrice: {
    type: Number,
  },
  totalOrderPrice: { type: Number },
  orderAddress: {
    type: String,
  },
  orderPlacedTime: { type: Date },
  notes: {
    type: String,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
