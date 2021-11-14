/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../../middleware/validateToken');
const Customer = require('../../models/customer');

const handle_request = async (msg, callback) => {
  try {
    if (!(msg.emailId && msg.passwd && msg.name && msg.contactNo)) {
      callback(
        {
          isError: true,
          errorStatus: 400,
          error: 'Please enter all fields!',
        },
        null,
      );
      return;
    }
    msg.passwd = await bcrypt.hash(msg.passwd, 12); // crypt the password
    const newCustomer = new Customer(msg);
    const cust = await newCustomer.save();
    const token = generateAccessToken(cust._id, 'customer');
    callback(null, { cust, token });
  } catch (error) {
    callback(
      {
        isError: true,
        errorStatus: 500,
        error,
      },
      null,
    );
  }
};

module.exports = handle_request;
