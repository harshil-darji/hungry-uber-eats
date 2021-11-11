/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../../middleware/validateToken');
const Restaurant = require('../../models/restaurant');

const handle_request = (msg, callback) => {
  const { emailId, passwd } = msg;
  if (!emailId || !passwd) {
    callback(
      {
        isError: true,
        errorStatus: 401,
        error: 'Please input all fields!',
      },
      null,
    );
    return;
  }
  Restaurant.findOne({
    emailId,
  })
    .select('passwd')
    .then((existingRest) => {
      if (!existingRest) {
        callback(
          {
            isError: true,
            errorStatus: 404,
            error: 'Email not found! Please register!',
          },
          null,
        );
        return;
      }
      bcrypt.compare(passwd, existingRest.passwd, (err, data) => {
        if (err) {
          callback(
            {
              isError: true,
              errorStatus: 401,
              error: 'Invalid password!',
            },
            null,
          );
          return;
        }
        if (data) {
          const token = generateAccessToken(existingRest._id, 'restaurant');
          callback(null, { message: 'Login successful!', token });
          return;
        }
        callback(
          {
            isError: true,
            errorStatus: 401,
            error: 'Invalid password!',
          },
          null,
        );
      });
    })
    .catch((err) => callback(err, null));
};

module.exports = handle_request;
