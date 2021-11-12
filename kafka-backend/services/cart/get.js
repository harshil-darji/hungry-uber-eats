/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Cart = require('../../models/cart');
const Restaurant = require('../../models/restaurant');

const handle_request = async (msg, callback) => {
  try {
    const { custId, id } = msg;
    if (String(id) !== String(custId)) {
      callback(
        {
          isError: true,
          errorStatus: 401,
          error: 'Unauthorized request!',
        },
        null,
      );
      return;
    }
    const customerCartItems = await Cart.findOne({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    if (!customerCartItems) {
      callback(null, []);
    }
    const temp = [];
    customerCartItems.dishes.forEach((cartDish) => {
      temp.push({ 'dishes._id': cartDish.dishId });
    });
    const dishesInfo = await Restaurant.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(String(customerCartItems.restId)),
        },
      },
      {
        $unwind: {
          path: '$dishes',
        },
      },
      {
        $match: {
          $or: temp,
        },
      },
      {
        $group: {
          _id: '$dishes',
        },
      },
    ]);

    const cartItems = await Cart.find({
      custId: mongoose.Types.ObjectId(String(custId)),
    })
      .populate({ path: 'restId', select: { _id: 1, name: 1, address: 1 } })
      .then((cece) => cece);
    callback(null, { cartItems, dishesInfo });
  } catch (error) {
    callback(
      {
        isError: true,
        errorStatus: 500,
        error: error.message,
      },
      null,
    );
  }
};

module.exports = handle_request;
