/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable object-curly-newline */
const mongoose = require('mongoose');
const Cart = require('../models/cart');
const { make_request } = require('../kafka/client');

const insertIntoCart = async (req, res) => {
  make_request(
    'cart.create',
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

const resetCartWithDifferentRestaurant = async (req, res) => {
  make_request(
    'cart.reset',
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

const viewCart = async (req, res) => {
  make_request(
    'cart.get',
    { ...req.params, id: req.headers.id },
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

const deleteFromCart = async (req, res) => {
  make_request(
    'cart.delete',
    { ...req.params, id: req.headers.id },
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

const clearCart = async (req, res) => {
  make_request(
    'cart.clear',
    { ...req.params, id: req.headers.id },
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

const getCartQuantity = async (req, res) => {
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const cartItems = await Cart.findOne({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    if (cartItems) {
      let dishesCount = 0;
      cartItems.dishes.forEach((dishInCart) => {
        dishesCount += dishInCart.dishQuantity;
      });
      return res.status(200).json({ totalDishesInCart: dishesCount });
    }
    return res.status(200).json({ totalDishesInCart: 0 });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  insertIntoCart,
  viewCart,
  deleteFromCart,
  getCartQuantity,
  clearCart,
  resetCartWithDifferentRestaurant,
};
