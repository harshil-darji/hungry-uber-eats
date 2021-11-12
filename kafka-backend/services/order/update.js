/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Order = require('../../models/order');

const handle_request = async (msg, callback) => {
  try {
    const { restId, orderId, body, id } = msg;
    const { orderStatus } = body;
    if (String(id) !== String(restId)) {
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
          error: 'Order has been cancelled!',
        },
        null,
      );
      return;
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(String(orderId)) },
      {
        $set: { orderStatus },
      },
    );
    callback(null, { message: 'Order status updated!', updatedOrder });
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
