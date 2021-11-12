/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../../middleware/validateToken');
const Customer = require('../../models/customer');

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
  Customer.findOne({
    emailId,
  })
    .select('passwd')
    .then((existingCustomer) => {
      if (!existingCustomer) {
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
      bcrypt.compare(passwd, existingCustomer.passwd, (err, data) => {
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
          const token = generateAccessToken(existingCustomer._id, 'customer');
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
