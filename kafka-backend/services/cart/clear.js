/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Cart = require('../../models/cart');

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
    const deletedCartItems = await Cart.findOneAndDelete({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    if (deletedCartItems) {
      callback(null, { message: 'Cart cleared successfully!' });
    }
    callback(
      {
        isError: true,
        errorStatus: 400,
        error: 'No items in cart!',
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
