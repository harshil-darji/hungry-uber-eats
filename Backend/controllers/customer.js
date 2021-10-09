/* eslint-disable operator-linebreak */
const bcrypt = require('bcrypt');
const {
  customer,
  customerAddress,
  custFavs,
  restaurant,
  restaurantImages,
} = require('../models/data-model');
const { generateAccessToken } = require('../middleware/validateToken');

const checkEmail = async (req, res) => {
  try {
    const checkUser = await customer.findOne({
      where: { emailId: req.body.emailId },
    });
    if (checkUser) {
      return res.status(409).json({
        error: "There's already an account with this email. Please sign in.",
      });
    }
    return res.status(200).json({ message: 'Email found!' });
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
    const cust = await customer.create(req.body);
    const token = generateAccessToken(cust.custId, 'customer');
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
    const checkUser = await customer.findOne({
      where: { emailId: req.body.emailId },
    });
    if (checkUser) {
      return res.status(200).json({ message: 'Email valid!' });
    }
    return res.status(404).json({
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
    const existingCustomer = await customer.findOne({
      where: { emailId },
    });
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
        const token = generateAccessToken(existingCustomer.custId, 'customer');
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
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const user = await customer.findOne({
      where: { custId },
    });
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
    const [updated] = await customer.update(req.body, {
      where: { custId },
    });
    if (updated) {
      const updatedUser = await customer.findOne({
        where: { custId },
      });
      return res.status(200).json({ user: updatedUser });
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
    const checkExistingAddress = await customerAddress.findOne({
      custId,
      address,
    });
    if (checkExistingAddress === address) {
      return res.status(409).json({ error: 'Address already exists!' });
    }
    const cust = await customerAddress.create({
      custId,
      address,
    });
    return res
      .status(200)
      .json({ message: 'Address added successfully!', cust });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { custId } = req.params;
    const deleted = await customer.destroy({
      where: { custId },
    });
    if (deleted) {
      return res
        .status(200)
        .json({ message: 'Customer deleted successfully!' });
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
    const existingAddresses = await customerAddress.findAll({});
    if (!existingAddresses) {
      return res.status(409).json({ error: 'No addresses found!' });
    }
    return res.status(200).json({ existingAddresses });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteCustomerAddress = async (req, res) => {
  try {
    const { custId, id } = req.params;
    const deleted = await customerAddress.destroy({
      where: { custId, id },
    });
    if (deleted) {
      return res.status(200).json({ message: 'Address deleted successfully!' });
    }
    return res.status(404).json({ error: 'Address not found!' });
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
    const custFav = await custFavs.create({
      custId,
      restId,
    });
    return res.status(200).json({ custFav });
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
