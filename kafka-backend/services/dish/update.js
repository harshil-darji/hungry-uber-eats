/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Restaurant = require('../../models/restaurant');

const checkProperties = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
      // eslint-disable-next-line no-param-reassign
      delete obj[key];
    }
  });
};

const handle_request = (msg, callback) => {
  const { restId, dishId, body, id } = msg;
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

  checkProperties(body);

  const updatedObj = {};
  Object.keys(body).forEach((key) => {
    updatedObj[`dishes.$.${key}`] = body[key];
  });

  Restaurant.updateOne(
    {
      _id: mongoose.Types.ObjectId(String(restId)),
      'dishes._id': mongoose.Types.ObjectId(String(dishId)),
    },
    { $set: updatedObj },
  )
    .then((updatedDish) => {
      if (!updatedDish) {
        callback(
          {
            isError: true,
            errorStatus: 404,
            error: 'Dish not found!',
          },
          null,
        );
        return;
      }
      callback(null, { message: 'Dish updated!' });
    })
    .catch((err) => callback(err, null));
};

module.exports = handle_request;
