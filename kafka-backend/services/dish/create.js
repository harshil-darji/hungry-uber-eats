/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Restaurant = require('../../models/restaurant');

const handle_request = (msg, callback) => {
  const { restId, id, body } = msg;
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
  const dishId = new mongoose.Types.ObjectId();
  Restaurant.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(String(restId)) },
    { $push: { dishes: { _id: dishId, ...body } } },
    { new: true },
  )
    .then(() => {
      callback(null, { dishId, message: 'Dish added!' });
    })
    .catch((err) => callback(err, null));
};

module.exports = handle_request;
