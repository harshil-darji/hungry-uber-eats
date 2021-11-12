/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Cart = require('../../models/cart');
const Order = require('../../models/order');
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
    await Order.findOneAndDelete({
      custId: mongoose.Types.ObjectId(String(custId)),
      orderStatus: 'Initialized',
    });
    const cartItems = await Cart.findOne({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    if (!cartItems) {
      callback(
        {
          isError: true,
          errorStatus: 400,
          error: 'No items in cart!',
        },
        null,
      );
      return;
    }
    const { restId } = cartItems;
    const cE = await Cart.findOne({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    const temp = [];
    cE.dishes.forEach((cartDish) => {
      temp.push({ 'dishes._id': cartDish.dishId });
    });
    const dishIdToDishQty = {};
    cE.dishes.forEach((cartDish) => {
      const dId = cartDish.dishId;
      dishIdToDishQty[dId] = cartDish.dishQuantity;
    });

    const dishes = await Restaurant.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(String(restId)),
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
      {
        $addFields: { dishDetails: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    let price = 0;
    dishes.forEach((element) => {
      // Set dish quantity from ID to Qty object
      element.dishDetails.dishQuantity = dishIdToDishQty[element.dishDetails._id];
      // Set total dish price
      element.dishDetails.totalDishPrice = Math.round(
        (element.dishDetails.dishPrice * element.dishDetails.dishQuantity
            + Number.EPSILON)
            * 100,
      ) / 100;
      // Add prices of dishes
      price += element.dishDetails.totalDishPrice;
    });

    price = Math.round((price + Number.EPSILON) * 100) / 100;

    const taxPrice = Math.round((price * 0.1 + Number.EPSILON) * 100) / 100;
    const totalOrderPrice = Math.round((price + taxPrice + Number.EPSILON) * 100) / 100;

    const newOrderEntry = new Order({
      custId,
      restId,
      dishes,
      orderStatus: 'Initialized',
      price,
      taxPrice,
      totalOrderPrice,
    });
    const orderEnttry = await newOrderEntry.save();
    callback(null, {
      orderEnttry,
      message: 'Order initialized!',
    });
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
