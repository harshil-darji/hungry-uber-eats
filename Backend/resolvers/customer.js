const { GraphQLError } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Customer = require('../models/customer');
const { generateAccessToken } = require('../middleware/validateToken');

const customer = async (args) => {
  try {
    const { custId } = args;
    const user = await Customer.findById(
      mongoose.Types.ObjectId(String(custId)),
    );
    if (!user) {
      return new GraphQLError('Customer with specified ID does not exist!');
    }
    return user;
  } catch (error) {
    return new GraphQLError(error);
  }
};

const createCustomer = async (args) => {
  try {
    const custArgs = args.customer;
    if (!(custArgs.emailId && custArgs.passwd && custArgs.name && custArgs.contactNo)) {
      return new GraphQLError('Please enter all fields!');
    }
    custArgs.passwd = await bcrypt.hash(custArgs.passwd, 12); // crypt the password
    const newCustomer = new Customer(custArgs);
    const cust = await newCustomer.save();
    const token = generateAccessToken(cust._id, 'customer');
    const response = { cust, token };
    return response;
  } catch (error) {
    return new GraphQLError(error);
  }
}

module.exports = { customer, createCustomer };
