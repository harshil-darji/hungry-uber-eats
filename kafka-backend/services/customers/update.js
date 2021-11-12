/* eslint-disable no-useless-return */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Customer = require('../../models/customer');

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
  Customer.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(String(custId)) },
    { $set: body },
    { new: true },
  )
    .then((updatedUser) => {
      callback(null, updatedUser);
    })
    .catch((err) => callback(err, null));
};

module.exports = handle_request;
