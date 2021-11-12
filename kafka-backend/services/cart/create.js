/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Cart = require('../../models/cart');
const Restaurant = require('../../models/restaurant');

const handle_request = async (msg, callback) => {
  try {
    const { custId, body, id } = msg;
    if (String(id) !== String(custId)) {
      callback(
        {
          isError: true,
          errorStatus: 401,
          error: 'Unauthorized request!',
        },
        null,
      );
      return;
    }
    const { restId } = body;
    const { dishId, dishQuantity } = body.dishes;
    // If restaurant ID or Dish ID is not sent
    if (!restId) {
      callback(
        {
          isError: true,
          errorStatus: 400,
          error: 'Please select restaurant!',
        },
        null,
      );
      return;
    }
    if (!dishId) {
      callback(
        {
          isError: true,
          errorStatus: 400,
          error: 'Please select dish!',
        },
        null,
      );
      return;
    }
    const checkExistingRest = await Restaurant.findById(
      mongoose.Types.ObjectId(String(restId)),
    );
    // Check if restaurant ID or Dish ID exists in database
    if (!checkExistingRest) {
      callback(
        {
          isError: true,
          errorStatus: 404,
          error: 'Restaurant not found!',
        },
        null,
      );
      return;
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
      callback(
        {
          isError: true,
          errorStatus: 404,
          error: 'Dish not found!',
        },
        null,
      );
      return;
    }
    const latestCartEntry = await Cart.findOne({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    if (!latestCartEntry) {
      body.custId = custId;
      const cartEnt = new Cart(body);
      const cartEntry = await cartEnt.save().then(
        Cart.populate(cartEnt, {
          path: 'restId',
          select: { _id: 1, name: 1, address: 1 },
        }).then((caca) => caca),
      );
      callback(null, { cartEntry });
      return;
    }
    // If added into cart from different restaurant
    if (latestCartEntry.restId.toString() !== restId) {
      callback(null, {
        message: 'Create new order?',
        ...body,
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
      callback(null, { cartEntry, dishesInfo });
      return;
    }

    // else push new dish to dishes array with dish quantity
    await Cart.findOneAndUpdate(
      { _id: latestCartEntry._id },
      { $push: { dishes: { ...body.dishes } } },
      { new: true },
    );

    const cartEntry = await Cart.find({
      custId: mongoose.Types.ObjectId(String(custId)),
    })
      .populate({ path: 'restId', select: { _id: 1, name: 1, address: 1 } })
      .then((cece) => cece);
    callback(null, { cartEntry });
    return;
  } catch (error) {
    callback(
      {
        isError: true,
        errorStatus: 500,
        error: error.message,
      },
      null,
    );
  }
};

module.exports = handle_request;
