const { GraphQLError } = require('graphql');
const mongoose = require('mongoose');
const Cart = require('../models/cart');
const Restaurant = require('../models/restaurant');

const cart = async (args, req) => {
  try {
    const { custId } = args;
    const { id } = req.headers;
    if (String(id) !== String(custId)) {
      throw new GraphQLError('Unauthorized request!');
    }
    const customerCartItems = await Cart.findOne({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    if (!customerCartItems) {
      return [];
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
    const resp = { cartItems, dishesInfo };
    return resp;
  } catch (error) {
    throw new GraphQLError(
      error.message ? error.message : 'Internal server error!',
    );
  }
};

module.exports = { cart };
