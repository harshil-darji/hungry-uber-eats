/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../../middleware/validateToken');
const Restaurant = require('../../models/restaurant');

const handle_request = (msg, callback) => {
  // Check if email already exists
  Restaurant.find({
    emailId: msg.emailId,
  })
    .then((checkRestaurant) => {
      if (checkRestaurant.length) {
        callback(
          {
            isError: true,
            error:
              "There's already an account with this email. Please sign in.",
          },
          null,
        );
      }
    })
    .catch((err) => callback(err, null));
  // Else create new restaurant
  bcrypt
    .hash(msg.passwd, 12)
    .then((hash) => {
      msg.passwd = hash;
      const newRestaurant = new Restaurant(msg);
      return newRestaurant.save();
    })
    .then((rest) => {
      const token = generateAccessToken(rest._id, 'restaurant');
      return { rest, token };
    })
    .then((resp) => {
      callback(null, { ...resp });
    })
    .catch((err) => callback(err, null));
};

module.exports = handle_request;
