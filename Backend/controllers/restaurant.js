const { getPaiganation } = require('u-server-utils');
const { restaurant, dish } = require('../models/data-model');

// Restaurants

const createRestaurant = async (req, res) => {
  try {
    // Check if email already exists
    const checkRestaurant = await restaurant.findOne({
      where: { emailId: req.body.emailId },
    });
    if (checkRestaurant) {
      return res.status(409).json({
        error: "There's already an account with this email. Please sign in.",
      });
    }
    // Else create new restaurant
    const rest = await restaurant.create(req.body);
    return res.status(201).json({
      rest,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRestaurant = async (req, res) => {
  try {
    const { restId } = req.params;
    const rest = await restaurant.findOne({
      where: { restId },
    });
    if (rest) {
      return res.status(200).json({ rest });
    }
    return res.status(404).json({ error: 'Restaurant with the specified ID does not exist!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const { restId } = req.params;
    const [updated] = await restaurant.update(req.body, {
      where: { restId },
    });
    if (updated) {
      const updatedRest = await restaurant.findOne({ where: { restId } });
      return res.status(200).json({ user: updatedRest });
    }
    return res.status(404).json({ error: 'Restaurant not found!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const { restId } = req.params;
    const deleted = await restaurant.destroy({
      where: { restId },
    });
    if (deleted) {
      return res.status(200).json({ message: 'Restaurant deleted successfully!' });
    }
    return res.status(404).json({ error: 'Restaurant not found!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRestaurants = async (req, res) => {
  try {
    const { limit, offset } = getPaiganation(req.query.page, req.query.limit);
    const restaurants = await restaurant.findAll({ limit, offset });
    return res.status(200).json({ restaurants });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// Dishes
const createDish = async (req, res) => {
  try {
    const { restId } = req.params;
    const existingDish = await dish.findOne({
      where: { restId, name: req.body.name },
    });
    if (existingDish) {
      return res.status(409).json({ error: `Dish ${req.body.name} already exists!` });
    }
    const body = { ...req.body, restId };
    const newDish = await dish.create(body);
    return res.status(201).json({
      newDish,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRestaurantDishes = async (req, res) => {
  const { restId } = req.params;
  const { limit, offset } = getPaiganation(req.query.page, req.query.limit);
  try {
    const dishes = await dish.findAll({ limit, offset, where: { restId } });
    if (!dishes) return res.status(404).json({ error: 'Restaurant not found!' });
    return res.status(200).json({ dishes });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getRestaurantDish = async (req, res) => {
  try {
    const { restId, dishId } = req.params;
    const existingDish = await dish.findOne({
      where: { restId, dishId },
    });
    if (existingDish) return res.status(200).json({ existingDish });
    return res.status(404).json({ error: 'Dish not found!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateRestaurantDish = async (req, res) => {
  try {
    const { restId, dishId } = req.params;
    const [updated] = await dish.update(req.body, {
      where: { restId, dishId },
    });
    if (updated) {
      const updatedDish = await dish.findOne({ where: { restId, dishId } });
      return res.status(200).json({ user: updatedDish });
    }
    return res.status(404).json({ error: 'Dish not found!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteRestaurantDish = async (req, res) => {
  try {
    const { restId, dishId } = req.params;
    const deletedDish = await dish.destroy({
      where: { restId, dishId },
    });
    if (deletedDish) {
      return res.status(200).json({ message: 'Dish deleted successfully!' });
    }
    return res.status(404).json({ error: 'Dish not found!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurants,
  createDish,
  getRestaurantDishes,
  getRestaurantDish,
  updateRestaurantDish,
  deleteRestaurantDish,
};
