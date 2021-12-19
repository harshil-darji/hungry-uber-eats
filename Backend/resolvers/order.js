const { GraphQLError } = require('graphql');
const mongoose = require('mongoose');
const Order = require('../models/order');

const order = async (args, req) => {
  try {
    const { orderId, custId } = args;
    const { id } = req.headers;
    if (String(id) !== String(custId)) {
      throw new GraphQLError('Unauthorized request!');
    }
    const orderDetails = await Order.findOne({
      _id: mongoose.Types.ObjectId(String(orderId)),
      custId: mongoose.Types.ObjectId(String(custId)),
    })
      .sort({ $natural: -1 })
      .populate({ path: 'restId' });

    return orderDetails;
  } catch (error) {
    throw new GraphQLError(
      error.message ? error.message : 'Internal server error!',
    );
  }
};

module.exports = { order };
