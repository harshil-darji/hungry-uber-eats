/* eslint-disable operator-linebreak */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Cart = require('../../models/cart');
const Order = require('../../models/order');

const checkProperties = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
      // eslint-disable-next-line no-param-reassign
      delete obj[key];
    }
  });
};

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
    const { orderType, orderAddress, notes } = body;
    const orderPlacedTime = Date.now();
    if (!orderType) {
      callback(
        {
          isError: true,
          errorStatus: 400,
          error: 'Please select order type!',
        },
        null,
      );
      return;
    }
    if (orderType === 'Delivery' && orderAddress.length === 0) {
      callback(
        {
          isError: true,
          errorStatus: 400,
          error: 'Please enter your address!',
        },
        null,
      );
      return;
    }
    const cartItems = await Cart.findOne({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    if (!cartItems) {
      callback(
        {
          isError: true,
          errorStatus: 404,
          error: 'No such order! Add items to cart and checkout first!',
        },
        null,
      );
      return;
    }
    await Cart.findOneAndDelete({
      custId: mongoose.Types.ObjectId(String(custId)),
    });

    const latestOrder = await Order.find({
      custId: mongoose.Types.ObjectId(String(custId)),
      orderStatus: 'Initialized',
    })
      .limit(1)
      .sort({ $natural: -1 });

    if (!latestOrder.length) {
      callback(
        {
          isError: true,
          errorStatus: 400,
          error: 'No such order!',
        },
        null,
      );
      return;
    }

    const toUpdateObj = {
      orderPlacedTime,
      orderStatus: 'Placed',
      notes,
      orderAddress,
      orderType,
    };
    checkProperties(toUpdateObj);

    if (orderType === 'Delivery') {
      toUpdateObj.totalOrderPrice =
        Math.round(
          (latestOrder[0].totalOrderPrice + 0.49 + Number.EPSILON) * 100,
        ) / 100;
    }

    const updatedOrder = await Order.updateOne(
      {
        custId: mongoose.Types.ObjectId(String(custId)),
        orderStatus: 'Initialized',
      },
      {
        $set: toUpdateObj,
      },
      { new: true, multi: true },
    );

    callback(null, {
      updatedOrder,
      message: 'Order placed successfully!',
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
