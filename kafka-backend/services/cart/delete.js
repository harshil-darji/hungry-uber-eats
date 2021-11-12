/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Cart = require('../../models/cart');

const handle_request = async (msg, callback) => {
  try {
    const { custId, dishId, id } = msg;
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
    const checkExistingDish = await Cart.findOne({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    if (!checkExistingDish) {
      callback(
        {
          isError: true,
          errorStatus: 404,
          error: 'No dish found in cart!',
        },
        null,
      );
      return;
    }
    const deletedCartItem = await Cart.updateOne(
      { custId: mongoose.Types.ObjectId(String(custId)) },
      {
        $pull: {
          dishes: { dishId: mongoose.Types.ObjectId(String(dishId)) },
        },
      },
      { new: true },
    );
    if (deletedCartItem) {
      callback(null, { message: 'Item removed from cart successfully!' });
      return;
    }
    callback(
      {
        isError: true,
        errorStatus: 404,
        error: 'Item could not be deleted!',
      },
      null,
    );
    return;
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
