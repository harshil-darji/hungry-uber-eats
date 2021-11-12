/* eslint-disable no-useless-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Customer = require('../../../models/customer');

const handle_request = (msg, callback) => {
  const { custId, addressId } = msg;
  Customer.find(
    {
      _id: mongoose.Types.ObjectId(String(custId)),
      'addresses._id': mongoose.Types.ObjectId(String(addressId)),
    },
    {
      addresses: {
        $elemMatch: { _id: mongoose.Types.ObjectId(String(addressId)) },
      },
    },
  )
    .then((existingAddress) => {
      if (!existingAddress.length) {
        callback(
          {
            isError: true,
            errorStatus: 404,
            error: 'Address not found!',
          },
          null,
        );
        return;
      }
    })
    .then(() => {
      Customer.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(String(custId)) },
        {
          $pull: {
            addresses: { _id: mongoose.Types.ObjectId(String(addressId)) },
          },
        },
        { new: true },
      )
        .then(() => {
          callback(null, { message: 'Address deleted successfully!' });
        })
        .catch((err) => callback(err, null));
    })
    .catch((err) => callback(err, null));
};

module.exports = handle_request;
