/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable object-curly-newline */
const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant');
const Cart = require('../models/cart');

const insertIntoCart = async (req, res) => {
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const { restId } = req.body;
    const { dishId, dishQuantity } = req.body.dishes;
    // If restaurant ID or Dish ID is not sent
    if (!restId) {
      return res.status(400).json({ error: 'Please select restaurant!' });
    }
    if (!dishId) {
      return res.status(400).json({ error: 'Please select dish!' });
    }
    const checkExistingRest = await Restaurant.findById(
      mongoose.Types.ObjectId(String(restId)),
    );
    // Check if restaurant ID or Dish ID exists in database
    if (!checkExistingRest) {
      return res.status(404).json({ error: 'Restaurant not found!' });
    }
    const checkExistingDish = await Restaurant.find(
      {
        'dishes._id': mongoose.Types.ObjectId(String(dishId)),
      },
      {
        dishes: {
          $elemMatch: { _id: mongoose.Types.ObjectId(String(dishId)) },
        },
      },
    );
    if (!checkExistingDish.length) {
      return res.status(404).json({ error: 'Dish not found!' });
    }
    const latestCartEntry = await Cart.findOne({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    if (!latestCartEntry) {
      req.body.custId = custId;
      const cartEnt = new Cart(req.body);
      const cartEntry = await cartEnt.save().then(
        Cart.populate(cartEnt, {
          path: 'restId',
          select: { _id: 1, name: 1, address: 1 },
        }).then((caca) => caca),
      );
      return res.status(200).json({
        cartEntry,
      });
    }
    // If added into cart from different restaurant
    if (latestCartEntry.restId.toString() !== restId) {
      return res.status(200).json({
        message: 'Create new order?',
        ...req.body,
        newRestId: restId,
        oldRestId: latestCartEntry.restId,
      });
    }
    // Else add dish into customer existing object / update existing dish quantity

    // if dish found, update dish quantity
    const existingDishInCart = await Cart.find(
      {
        'dishes.dishId': mongoose.Types.ObjectId(String(dishId)),
      },
      {
        dishes: {
          $elemMatch: { dishId: mongoose.Types.ObjectId(String(dishId)) },
        },
      },
    );
    if (existingDishInCart.length) {
      const cE = await Cart.findOne({
        custId: mongoose.Types.ObjectId(String(custId)),
      });
      const temp = [];
      cE.dishes.forEach((cartDish) => {
        temp.push({ 'dishes._id': cartDish.dishId });
      });
      const dishesInfo = await Restaurant.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(String(restId)),
          },
        },
        {
          $unwind: {
            path: '$dishes',
          },
        },
        {
          $match: {
            $or: temp,
          },
        },
        {
          $group: {
            _id: '$dishes',
          },
        },
      ]);

      const updatedObj = {};
      updatedObj['dishes.$.dishQuantity'] = dishQuantity;
      await Cart.updateOne(
        {
          _id: latestCartEntry._id.toString(),
          'dishes.dishId': mongoose.Types.ObjectId(String(dishId)),
        },
        { $set: updatedObj },
      );
      const cartEntry = await Cart.find({
        custId: mongoose.Types.ObjectId(String(custId)),
      })
        .populate({ path: 'restId', select: { _id: 1, name: 1, address: 1 } })
        .then((cece) => cece);
      return res.status(200).json({
        cartEntry,
        dishesInfo,
      });
    }

    // else push new dish to dishes array with dish quantity
    await Cart.findOneAndUpdate(
      { _id: latestCartEntry._id },
      { $push: { dishes: { ...req.body.dishes } } },
      { new: true },
    );

    const cartEntry = await Cart.find({
      custId: mongoose.Types.ObjectId(String(custId)),
    })
      .populate({ path: 'restId', select: { _id: 1, name: 1, address: 1 } })
      .then((cece) => cece);
    return res.status(200).json({
      cartEntry,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const resetCartWithDifferentRestaurant = async (req, res) => {
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const deletedCartItems = await Cart.findOneAndDelete({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    if (!deletedCartItems) {
      return res.status(404).json({ message: 'Cart could not be reset!' });
    }
    const { restId } = req.body;
    const { dishId } = req.body.dishes;
    // If restaurant ID or Dish ID is not sent
    if (!restId) {
      return res.status(400).json({ error: 'Please select restaurant!' });
    }
    if (!dishId) {
      return res.status(400).json({ error: 'Please select dish!' });
    }
    const checkExistingRest = await Restaurant.findById(
      mongoose.Types.ObjectId(String(restId)),
    );
    // Check if restaurant ID or Dish ID exists in database
    if (!checkExistingRest) {
      return res.status(404).json({ error: 'Restaurant not found!' });
    }
    const checkExistingDish = await Restaurant.find(
      {
        'dishes._id': mongoose.Types.ObjectId(String(dishId)),
      },
      {
        dishes: {
          $elemMatch: { _id: mongoose.Types.ObjectId(String(dishId)) },
        },
      },
    );
    if (!checkExistingDish.length) {
      return res.status(404).json({ error: 'Dish not found!' });
    }
    req.body.custId = custId;
    const cartEnt = new Cart(req.body);
    const cartEntry = await cartEnt.save().then(
      Cart.populate(cartEnt, {
        path: 'restId',
        select: { _id: 1, name: 1, address: 1 },
      }).then((caca) => caca),
    );
    return res.status(200).json({
      cartEntry,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const viewCart = async (req, res) => {
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const customerCartItems = await Cart.findOne({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    if (!customerCartItems) {
      return res.status(200).json([]);
    }
    const temp = [];
    customerCartItems.dishes.forEach((cartDish) => {
      temp.push({ 'dishes._id': cartDish.dishId });
    });
    const dishesInfo = await Restaurant.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(String(customerCartItems.restId)),
        },
      },
      {
        $unwind: {
          path: '$dishes',
        },
      },
      {
        $match: {
          $or: temp,
        },
      },
      {
        $group: {
          _id: '$dishes',
        },
      },
    ]);

    const cartItems = await Cart.find({
      custId: mongoose.Types.ObjectId(String(custId)),
    })
      .populate({ path: 'restId', select: { _id: 1, name: 1, address: 1 } })
      .then((cece) => cece);
    return res.status(200).json({ cartItems, dishesInfo });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const { custId, dishId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const checkExistingDish = await Cart.findOne({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    if (!checkExistingDish) {
      return res.status(404).json({ error: 'No dish found in cart!' });
    }
    const deletedCartItem = await Cart.updateOne(
      { custId: mongoose.Types.ObjectId(String(custId)) },
      {
        $pull: {
          dishes: { dishId: mongoose.Types.ObjectId(String(dishId)) },
        },
      },
      { new: true },
    );
    if (deletedCartItem) {
      return res
        .status(200)
        .json({ message: 'Item removed from cart successfully!' });
    }
    return res.status(404).json({ error: 'Item could not be deleted!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const deletedCartItems = await Cart.findOneAndDelete({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    if (deletedCartItems) {
      return res.status(200).json({ message: 'Cart cleared successfully!' });
    }
    return res.status(404).json({ error: 'No items in cart!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
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
