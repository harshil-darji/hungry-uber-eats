/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../../middleware/validateToken');
const Customer = require('../../models/customer');

const handle_request = (msg, callback) => {
  if (!(msg.emailId && msg.passwd && msg.name && msg.contactNo)) {
    callback(
      {
        isError: true,
        errorStatus: 400,
        error: 'Please enter all fields!',
      },
      null,
    );
  }
  bcrypt
    .hash(msg.passwd, 12)
    .then((hash) => {
      msg.passwd = hash;
      const newCustomer = new Customer(msg);
      return newCustomer.save();
    })
    .then((cust) => {
      const token = generateAccessToken(cust._id, 'customer');
      return { cust, token };
    })
    .then((resp) => {
      callback(null, { ...resp });
    })
    .catch((err) => callback(err, null));
};

module.exports = handle_request;
