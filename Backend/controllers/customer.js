/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable operator-linebreak */
const mongoose = require('mongoose');

const { make_request } = require('../kafka/client');
const Customer = require('../models/customer');

const checkEmail = async (req, res) => {
  try {
    const checkUser = await Customer.findOne({
      emailId: req.body.emailId,
    });
    if (checkUser) {
      return res.status(409).json({
        error: "There's already an account with this email. Please sign in.",
      });
    }
    return res.status(200).json({ message: 'Email valid for registration.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createCustomer = async (req, res) => {
  make_request('customer.create', req.body, (error, response) => {
    if (error || !response) {
      return res.status(500).json({ error });
    }
    return res.status(201).json({ ...response });
  });
};

const checkLoginEmail = async (req, res) => {
  try {
    const checkUser = await Customer.findOne({
      emailId: req.body.emailId,
    });
    if (checkUser) {
      return res.status(200).json({ message: 'Email valid!' });
    }
    return res.status(400).json({
      error: 'Email not found! Please register first.',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const loginCustomer = async (req, res) => {
  make_request('customer.login', req.body, (error, response) => {
    if (error || !response) {
      if ('errorStatus' in error) {
        return res.status(error.errorStatus).json({ error: error.error });
      }
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ ...response });
  });
};

const getCustomer = async (req, res) => {
  try {
    const { custId } = req.params;
    // if (String(req.headers.id) !== String(custId)) {
    //   return res.status(401).json({ error: 'Unauthorized request!' });
    // }
    const user = await Customer.findById(
      mongoose.Types.ObjectId(String(custId)),
    );
    if (!user) {
      return res.status(404).json({
        error: 'Customer with the specified ID does not exist!',
      });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  make_request(
    'customer.update',
    { ...req.params, body: req.body, id: req.headers.id },
    (error, response) => {
      if (error || !response) {
        if ('errorStatus' in error) {
          return res.status(error.errorStatus).json({ error: error.error });
        }
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ user: { ...response } });
    },
  );
};

const addCustomerAddress = async (req, res) => {
  make_request(
    'customer.address.create',
    { ...req.params, body: req.body, id: req.headers.id },
    (error, response) => {
      if (error || !response) {
        if ('errorStatus' in error) {
          return res.status(error.errorStatus).json({ error: error.error });
        }
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ ...response });
    },
  );
};

const deleteCustomer = async (req, res) => {
  try {
    const { custId } = req.params;
    const deleted = await Customer.findByIdAndDelete(
      mongoose.Types.ObjectId(String(custId)),
    );
    if (deleted) {
      return res
        .status(200)
        .json({ message: 'Customer account deleted successfully!' });
    }
    return res.status(404).json({ error: 'User not found!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCustomerAddresses = async (req, res) => {
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const user = await Customer.findById(
      mongoose.Types.ObjectId(String(custId)),
    );
    if (!user) {
      return res.status(404).json({
        error: 'User does not exist!',
      });
    }
    const existingAddresses = user.addresses;
    return res.status(200).json({ existingAddresses });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteCustomerAddress = async (req, res) => {
  make_request(
    'customer.address.delete',
    { ...req.params },
    (error, response) => {
      if (error || !response) {
        if ('errorStatus' in error) {
          return res.status(error.errorStatus).json({ error: error.error });
        }
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ ...response });
    },
  );
};

const addRestaurantToFavs = async (req, res) => {
  make_request(
    'customer.favourites.create',
    { ...req.params, body: req.body, id: req.headers.id },
    (error, response) => {
      if (error || !response) {
        if ('errorStatus' in error) {
          return res.status(error.errorStatus).json({ error: error.error });
        }
        return res.status(500).json({ error: error.message });
      }
      return res.status(201).json({ ...response });
    },
  );
};

const getRestaurantFavs = async (req, res) => {
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const cust = await Customer.findById(custId).populate({
      path: 'favouriteRestaurants',
      select: {
        _id: 1,
        name: 1,
        address: 1,
        restImages: 1,
      },
    });
    return res.status(200).json({ restaurants: cust.favouriteRestaurants });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  checkEmail,
  checkLoginEmail,
  createCustomer,
  loginCustomer,
  getCustomer,
  updateCustomer,
  addCustomerAddress,
  getCustomerAddresses,
  deleteCustomerAddress,
  deleteCustomer,
  addRestaurantToFavs,
  getRestaurantFavs,
};
