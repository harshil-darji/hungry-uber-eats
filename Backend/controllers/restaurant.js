/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unreachable */
/* eslint-disable consistent-return */
/* eslint-disable operator-linebreak */
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { generateAccessToken } = require('../middleware/validateToken');

const Restaurant = require('../models/restaurant');

// Restaurants

const checkProperties = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
      // eslint-disable-next-line no-param-reassign
      delete obj[key];
    }
  });
};

const createRestaurant = async (req, res) => {
  try {
    // Check if email already exists
    const checkRestaurant = await Restaurant.find({
      emailId: req.body.emailId,
    });
    if (checkRestaurant.length) {
      return res.status(409).json({
        error: "There's already an account with this email. Please sign in.",
      });
    }
    // Else create new restaurant
    req.body.passwd = await bcrypt.hash(req.body.passwd, 12); // crypt the password
    const newRestaurant = new Restaurant(req.body);
    const rest = await newRestaurant.save();
    const token = generateAccessToken(rest._id, 'restaurant');
    return res.status(201).json({
      rest,
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const loginRestaurant = async (req, res) => {
  try {
    const { emailId, passwd } = req.body;
    if (!emailId || !passwd) {
      return res.status(401).json({ error: 'Please input all fields!' });
    }
    const existingRest = await Restaurant.findOne({
      emailId,
    }).select('passwd');
    if (!existingRest) {
      return res
        .status(404)
        .json({ error: 'Email not found! Please register!' });
    }
    bcrypt.compare(passwd, existingRest.passwd, (err, data) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid password!' });
      }
      if (data) {
        const token = generateAccessToken(existingRest._id, 'restaurant');
        return res.status(200).json({ message: 'Login successful!', token });
      }
      return res.status(401).json({ error: 'Invalid password!' });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
  return null;
};

const getRestaurant = async (req, res) => {
  try {
    const { restId } = req.params;
    // if (String(req.headers.id) !== String(restId)) {
    //   return res.status(401).json({ error: 'Unauthorized request!' });
    // }
    const rest = await Restaurant.findById(
      mongoose.Types.ObjectId(String(restId)),
    );
    if (rest) {
      return res.status(200).json({ rest });
    }
    return res
      .status(404)
      .json({ error: 'Restaurant with the specified ID does not exist!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const { restId } = req.params;
    if (String(req.headers.id) !== String(restId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    if (req.body.restType) {
      const { restType } = req.body;
      delete req.body.restType;
      await Restaurant.updateOne(
        {
          _id: mongoose.Types.ObjectId(String(restId)),
        },
        { $set: { restType: [] } },
      );
      await Restaurant.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(String(restId)) },
        { $addToSet: { restType } },
        { new: true },
      );
    }
    const rest = await Restaurant.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(String(restId)) },
      { $set: req.body },
      { new: true },
    );
    return res.status(200).json({
      rest,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const { restId } = req.params;
    const deleted = await Restaurant.findByIdAndDelete(
      mongoose.Types.ObjectId(String(restId)),
    );
    if (deleted) {
      return res
        .status(200)
        .json({ message: 'Restaurant deleted successfully!' });
    }
    return res.status(404).json({ error: 'Restaurant not found!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRestaurants = async (req, res) => {
  try {
    const { city } = req.query;
    let { restType } = req.query;
    let { deliveryType } = req.query;

    if (deliveryType === 'Pickup') {
      deliveryType = ['Both', 'Pickup'];
    }
    if (deliveryType === 'Delivery') {
      deliveryType = ['Both', 'Delivery'];
    }

    if (restType === 'Any' || restType === '') {
      restType = null;
    }

    const searchObject = {
      city,
      deliveryType,
      restType,
    };

    checkProperties(searchObject);

    const restaurants = await Restaurant.find({
      // limit,
      // offset,
      ...searchObject,
    });

    return res.status(200).json({ restaurants });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const searchRestaurants = async (req, res) => {
  try {
    const { searchQuery } = req.query;
    // eslint-disable-next-line no-unused-vars
    const restaurants = await Restaurant.find({
      $or: [
        { name: new RegExp(`.*${searchQuery}.*`, 'i') },
        { description: new RegExp(`.*${searchQuery}.*`, 'i') },
        {
          dishes: {
            $elemMatch: { name: new RegExp(`.*${searchQuery}.*`, 'i') },
          },
        },
      ],
    });
    return res.status(200).json({ restaurants });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Dishes
const createDish = async (req, res) => {
  try {
    const { restId } = req.params;
    if (String(req.headers.id) !== String(restId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const dishId = new mongoose.Types.ObjectId();
    await Restaurant.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(String(restId)) },
      { $push: { dishes: { _id: dishId, ...req.body } } },
      { new: true },
    );
    return res.status(201).json({
      dishId,
      message: 'Dish added',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addRestaurantImage = async (req, res) => {
  const { restId } = req.params;
  try {
    if (!req.body.imageLink) {
      return res.status(400).json({ error: 'Image link not found!' });
    }
    const restImage = await Restaurant.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(String(restId)) },
      { $push: { restImages: req.body } },
      { new: true },
    );
    return res.status(201).json({
      restImage,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRestaurantImages = async (req, res) => {
  const { restId } = req.params;
  try {
    const restData = await Restaurant.findOne({
      _id: mongoose.Types.ObjectId(String(restId)),
    });
    if (!restData) {
      return res.status(404).json({ error: 'Restaurant not found!' });
    }
    return res.status(200).json({
      restImages: restData.restImages,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteRestaurantImage = async (req, res) => {
  const { restId, restImageId } = req.params;
  try {
    const existingImage = await Restaurant.find(
      {
        'restImages._id': mongoose.Types.ObjectId(String(restImageId)),
      },
      {
        restImages: {
          $elemMatch: { _id: mongoose.Types.ObjectId(String(restImageId)) },
        },
      },
    );
    if (!existingImage.length) {
      return res.status(404).json({ error: 'Image not found!' });
    }
    await Restaurant.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(String(restId)) },
      {
        $pull: {
          restImages: { _id: mongoose.Types.ObjectId(String(restImageId)) },
        },
      },
      { new: true },
    );
    return res.status(200).json({ message: 'Image deleted successfully!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRestaurantDishes = async (req, res) => {
  const { restId } = req.params;
  // const { limit, offset } = getPaiganation(req.query.page, req.query.limit);
  try {
    const restData = await Restaurant.findOne({
      _id: mongoose.Types.ObjectId(String(restId)),
    });
    if (!restData) {
      return res.status(404).json({ error: 'Restaurant not found!' });
    }
    return res.status(200).json({
      dishes: restData.dishes,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getRestaurantDish = async (req, res) => {
  try {
    const { dishId } = req.params;
    const existingDish = await Restaurant.find(
      {
        'dishes._id': mongoose.Types.ObjectId(String(dishId)),
      },
      {
        dishes: {
          $elemMatch: { _id: mongoose.Types.ObjectId(String(dishId)) },
        },
      },
    );
    if (existingDish.length) return res.status(200).json({ existingDish });
    return res.status(404).json({ error: 'Dish not found!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateRestaurantDish = async (req, res) => {
  try {
    const { restId, dishId } = req.params;
    if (String(req.headers.id) !== String(restId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    checkProperties(req.body);

    const updatedObj = {};
    Object.keys(req.body).forEach((key) => {
      updatedObj[`dishes.$.${key}`] = req.body[key];
    });

    const updatedDish = await Restaurant.updateOne(
      {
        _id: mongoose.Types.ObjectId(String(restId)),
        'dishes._id': mongoose.Types.ObjectId(String(dishId)),
      },
      { $set: updatedObj },
    );
    if (updatedDish) {
      return res.status(200).json({ updatedDish });
    }
    return res.status(404).json({ error: 'Dish not found!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteRestaurantDish = async (req, res) => {
  try {
    const { restId, dishId } = req.params;
    const existingDish = await Restaurant.find(
      {
        'dishes._id': mongoose.Types.ObjectId(String(dishId)),
      },
      {
        dishes: {
          $elemMatch: { _id: mongoose.Types.ObjectId(String(dishId)) },
        },
      },
    );
    if (!existingDish.length) {
      return res.status(404).json({ error: 'Dish not found!' });
    }
    await Restaurant.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(String(restId)) },
      { $pull: { dishes: { _id: mongoose.Types.ObjectId(String(dishId)) } } },
      { new: true },
    );
    return res.status(200).json({ message: 'Dish deleted successfully!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// TODO: Add API to delete dish image

module.exports = {
  createRestaurant,
  loginRestaurant,
  getRestaurant,
  updateRestaurant,
  addRestaurantImage,
  getRestaurantImages,
  deleteRestaurantImage,
  deleteRestaurant,
  getRestaurants,
  searchRestaurants,
  createDish,
  getRestaurantDishes,
  getRestaurantDish,
  updateRestaurantDish,
  deleteRestaurantDish,
};
