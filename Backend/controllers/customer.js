/* eslint-disable no-underscore-dangle */
/* eslint-disable operator-linebreak */
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {
  custFavs,
  restaurant,
  restaurantImages,
} = require('../models/data-model');
const { generateAccessToken } = require('../middleware/validateToken');

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
  try {
    if (
      !(
        req.body.emailId &&
        req.body.passwd &&
        req.body.name &&
        req.body.contactNo
      )
    ) {
      return res.status(400).json({ error: 'Please enter all fields! ' });
    }
    req.body.passwd = await bcrypt.hash(req.body.passwd, 12); // crypt the password
    const newCustomer = new Customer(req.body);
    const cust = await newCustomer.save();
    const token = generateAccessToken(cust._id, 'customer');
    return res.status(201).json({
      cust,
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
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
  try {
    const { emailId, passwd } = req.body;
    if (!emailId || !passwd) {
      return res.status(401).json({ error: 'Please input all fields!' });
    }
    const existingCustomer = await Customer.findOne({
      emailId,
    }).select('passwd');
    if (!existingCustomer) {
      return res
        .status(404)
        .json({ error: 'Email not found! Please register!' });
    }
    bcrypt.compare(passwd, existingCustomer.passwd, (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (data) {
        const token = generateAccessToken(existingCustomer._id, 'customer');
        return res.status(200).json({ token, cust: existingCustomer });
      }
      return res.status(401).json({ error: 'Invalid password!' });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
  return null;
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
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const updatedUser = await Customer.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(String(custId)) },
      { $set: req.body },
      { new: true },
    );
    if (updatedUser) {
      return res.status(200).json({
        user: updatedUser,
      });
    }
    return res.status(404).json({ error: 'User not found!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addCustomerAddress = async (req, res) => {
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ error: 'Please enter address!' });
    }
    const cust = await Customer.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(String(custId)) },
      { $push: { addresses: req.body } },
      { new: true },
    );
    return res.status(200).json({
      cust,
      message: 'Address added successfully!',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
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
  try {
    const { custId, addressId } = req.params;
    const existingAddress = await Customer.find(
      {
        'addresses._id': mongoose.Types.ObjectId(String(addressId)),
      },
      {
        addresses: {
          $elemMatch: { _id: mongoose.Types.ObjectId(String(addressId)) },
        },
      },
    );
    if (!existingAddress.length) {
      return res.status(404).json({ error: 'Address not found!' });
    }
    await Customer.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(String(custId)) },
      {
        $pull: {
          addresses: { _id: mongoose.Types.ObjectId(String(addressId)) },
        },
      },
      { new: true },
    );
    return res.status(200).json({ message: 'Address deleted successfully!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addRestaurantToFavs = async (req, res) => {
  try {
    const { custId } = req.params;
    const { restId } = req.body;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const customerFavExists = await custFavs.findOne({
      where: { custId, restId },
    });
    if (customerFavExists) {
      return res
        .status(200)
        .json({ message: 'Restaurant already in favourites' });
    }
    const custFav = await custFavs.create({
      custId,
      restId,
    });
    return res.status(200).json({ custFav, message: 'Added to favourites!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRestaurantFavs = async (req, res) => {
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const customerFavs = await custFavs.findAll({
      where: { custId },
      attributes: [],
      include: [
        {
          model: restaurant,
          attributes: { exclude: ['createdAt', 'updatedAt', 'passwd'] },
          include: [
            {
              model: restaurantImages,
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
      ],
    });
    const restaurants = [];
    customerFavs.forEach((custFav) => {
      restaurants.push(custFav.restaurant);
    });
    return res.status(200).json({ restaurants });
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
