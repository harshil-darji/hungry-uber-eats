/* eslint-disable camelcase */
const mongoose = require('mongoose');
const { make_request } = require('../kafka/client');
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

const createRestaurant = (req, res) => {
  make_request('restaurant.create', req.body, (error, response) => {
    if (error || !response) {
      return res.status(500).json({ error });
    }
    return res.status(201).json({ response });
  });
};

const loginRestaurant = async (req, res) => {
  make_request('restaurant.login', req.body, (error, response) => {
    if (error || !response) {
      if ('errorStatus' in error) {
        return res.status(error.errorStatus).json({ error: error.error });
      }
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ ...response });
  });
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
  make_request(
    'restaurant.update',
    { ...req.params, body: req.body, id: req.headers.id },
    (error, response) => {
      if (error || !response) {
        if ('errorStatus' in error) {
          return res.status(error.errorStatus).json({ error: error.error });
        }
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ rest: { ...response } });
    },
  );
};

const deleteRestaurant = async (req, res) => {
  make_request('restaurant.delete', { ...req.params }, (error, response) => {
    if (error || !response) {
      if ('errorStatus' in error) {
        return res.status(error.errorStatus).json({ error: error.error });
      }
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ ...response });
  });
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
  make_request(
    'dish.create',
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

const addRestaurantImage = async (req, res) => {
  make_request(
    'restaurant.image.create',
    { ...req.params, body: req.body },
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
  make_request(
    'restaurant.image.delete',
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
  make_request(
    'dish.update',
    { ...req.params, body: req.body, id: req.headers.id },
    (error, response) => {
      if (error || !response) {
        if ('errorStatus' in error) {
          return res.status(error.errorStatus).json({ error: error.error });
        }
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ rest: { ...response } });
    },
  );
};

const deleteRestaurantDish = async (req, res) => {
  make_request('dish.delete', { ...req.params }, (error, response) => {
    if (error || !response) {
      if ('errorStatus' in error) {
        return res.status(error.errorStatus).json({ error: error.error });
      }
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ ...response });
  });
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
