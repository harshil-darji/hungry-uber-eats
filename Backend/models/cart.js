const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
  custId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  restId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  dishes: [
    {
      dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
      dishQuantity: { type: Number },
    },
  ],
});

module.exports = mongoose.model('Cart', CartSchema);
