/* eslint-disable no-useless-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Customer = require('../../../models/customer');

const handle_request = (msg, callback) => {
  const { custId, body, id } = msg;
  const { restId } = body;
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
  Customer.findById(custId)
    .then((cust) => {
      const custFavExists = cust.favouriteRestaurants.includes(
        mongoose.Types.ObjectId(String(restId)),
      );
      if (custFavExists) {
        callback(null, {
          message: 'Restaurant already in favourites',
        });
        return;
      }
    })
    .then(() => {
      Customer.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(String(custId)) },
        { $addToSet: { favouriteRestaurants: { _id: restId } } },
        { new: true },
      )
        .then((custFav) => {
          callback(null, {
            custFav,
            message: 'Restaurant added to favourites',
          }).catch((err) => callback(err, null));
        })
        .catch((err) => callback(err, null));
    })
    .catch((err) => callback(err, null));
};

module.exports = handle_request;
