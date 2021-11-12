/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Customer = require('../../../models/customer');

const handle_request = (msg, callback) => {
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
  const { address } = body;
  if (!address) {
    callback(
      {
        isError: true,
        errorStatus: 400,
        error: 'Please enter address!',
      },
      null,
    );
    return;
  }
  Customer.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(String(custId)) },
    { $push: { addresses: body } },
    { new: true },
  )
    .then((cust) => {
      callback(null, { cust, message: 'Address added successfully!' });
    })
    .catch((err) => callback(err, null));
};

module.exports = handle_request;
