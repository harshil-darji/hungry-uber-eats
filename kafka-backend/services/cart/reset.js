/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Cart = require('../../models/cart');
const Restaurant = require('../../models/restaurant');

const handle_request = async (msg, callback) => {
  try {
    const { custId, body, id } = msg;
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
    const deletedCartItems = await Cart.findOneAndDelete({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    if (!deletedCartItems) {
      callback(
        {
          isError: true,
          errorStatus: 404,
          error: 'Cart could not be reset!',
        },
        null,
      );
      return;
    }
    const { restId } = body;
    const { dishId } = body.dishes;
    // If restaurant ID or Dish ID is not sent
    if (!restId) {
      callback(
        {
          isError: true,
          errorStatus: 400,
          error: 'Please select restaurant!',
        },
        null,
      );
      return;
    }
    if (!dishId) {
      callback(
        {
          isError: true,
          errorStatus: 400,
          error: 'Please select dish!',
        },
        null,
      );
      return;
    }
    const checkExistingRest = await Restaurant.findById(
      mongoose.Types.ObjectId(String(restId)),
    );
    // Check if restaurant ID or Dish ID exists in database
    if (!checkExistingRest) {
      callback(
        {
          isError: true,
          errorStatus: 404,
          error: 'Restaurant not found!',
        },
        null,
      );
      return;
    }
    const checkExistingDish = await Restaurant.find(
      {
        'dishes._id': mongoose.Types.ObjectId(String(dishId)),
      },
      {
        dishes: {
          $elemMatch: { _id: mongoose.Types.ObjectId(String(dishId)) },
        },
      },
    );
    if (!checkExistingDish.length) {
      callback(
        {
          isError: true,
          errorStatus: 404,
          error: 'Dish not found!',
        },
        null,
      );
      return;
    }
    body.custId = custId;
    const cartEnt = new Cart(body);
    const cartEntry = await cartEnt.save().then(
      Cart.populate(cartEnt, {
        path: 'restId',
        select: { _id: 1, name: 1, address: 1 },
      }).then((caca) => caca),
    );
    callback(null, { cartEntry });
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
