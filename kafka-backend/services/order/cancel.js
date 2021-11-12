/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Order = require('../../models/order');

const handle_request = async (msg, callback) => {
  try {
    const { custId, orderId, id } = msg;
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
    const order = await Order.findById(orderId);
    if (order.orderStatus === 'Cancelled') {
      callback(
        {
          isError: true,
          errorStatus: 400,
          error: 'Order is already cancelled!',
        },
        null,
      );
      return;
    }
    if (order.orderStatus !== 'Initialized' && order.orderStatus !== 'Placed') {
      callback(
        {
          isError: true,
          errorStatus: 400,
          error: 'Cannot cancel order now! Order is being prepared.',
        },
        null,
      );
      return;
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(String(orderId)) },
      {
        $set: { orderStatus: 'Cancelled' },
      },
    );
    callback(null, { message: 'Order cancelled!', updatedOrder });
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
