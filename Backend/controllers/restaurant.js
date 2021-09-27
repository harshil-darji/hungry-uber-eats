/* eslint-disable consistent-return */
/* eslint-disable operator-linebreak */
const bcrypt = require('bcrypt');
// const { getPaiganation } = require('u-server-utils');
const { generateAccessToken } = require('../middleware/validateToken');
const {
  restaurant,
  dish,
  restaurantType,
  sequelize,
} = require('../models/data-model');

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
    req.body.passwd = await bcrypt.hash(req.body.passwd, 12); // crypt the password
    const rest = await restaurant.create(req.body);
    const token = generateAccessToken(rest.restId, 'restaurant');
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
    const existingRest = await restaurant.findOne({
      where: { emailId },
    });
    if (!existingRest) {
      return res
        .status(404)
        .json({ error: 'Email not found! Please register!' });
    }
    bcrypt.compare(passwd, existingRest.passwd, (err) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid password!' });
      }
      const token = generateAccessToken(existingRest.restId, 'restaurant');
      return res.status(200).json({ message: 'Login successful!', token });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
  return null;
};

const getRestaurant = async (req, res) => {
  try {
    const { restId } = req.params;
    if (String(req.headers.id) !== String(restId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const rest = await restaurant.findOne({
      where: { restId },
      include: [{ model: restaurantType }],
    });
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
  const t = await sequelize.transaction();
  try {
    const { restId } = req.params;
    if (String(req.headers.id) !== String(restId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const updated = await restaurant.update(
      req.body,
      {
        where: { restId },
      },
      { transaction: t },
    );
    if (updated) {
      const updatedRest = await restaurant.findOne({ where: { restId } });
      if (req.body.restType.length > 0) {
        const enumVals = ['Veg', 'Non-veg', 'Vegan'];
        req.body.restType.forEach((restType) => {
          if (!enumVals.includes(restType)) {
            return res
              .status(400)
              .json({ error: 'Invalid restaurant type(s) selected!' });
          }
        });
        const existingRestTypes = await restaurantType.findAll(
          {
            raw: true,
            where: { restId },
            attributes: ['restType'],
          },
          { transaction: t },
        );
        const restTypes = [];
        existingRestTypes.forEach((ele) => {
          restTypes.push(ele.restType);
        });
        let restType = req.body.restType.filter((x) => !restTypes.includes(x));
        restType.forEach(async (element) => {
          restType = await restaurantType.create(
            {
              restType: element,
              restId: parseInt(restId, 10),
            },
            { transaction: t },
          );
        });
        const rest = await restaurant.findOne(
          {
            where: { restId },
            include: [{ model: restaurantType }],
          },
          { transaction: t },
        );
        t.commit();
        return res.status(200).json({ rest });
      }
      await t.rollback();
      return res.status(200).json({ rest: updatedRest });
    }
    await t.rollback();
    return res.status(404).json({ error: 'Restaurant not found!' });
  } catch (error) {
    await t.rollback();
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
    // const { limit, offset } = getPaiganation(req.query.page, req.query.limit);
    const restaurants = await restaurant.findAll({});
    if (!restaurants) {
      return res.status(200).json({ message: 'No restaurants found!' });
    }
    return res.status(200).json({ restaurants });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addRestaurantType = async (req, res) => {
  try {
    const { restId } = req.params;
    if (String(req.headers.id) !== String(restId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const rest = await restaurant.findOne({
      where: { restId },
    });
    if (rest) {
      if (
        req.body.restType !== 'Veg' &&
        req.body.restType !== 'Non-veg' &&
        req.body.restType !== 'Vegan'
      ) {
        return res
          .status(400)
          .json({ error: 'Invalid restaurant type selected!' });
      }
      let restType = await restaurantType.findOne({
        where: { restId, restType: req.body.restType },
      });
      if (restType) {
        return res.status(200).json({ restType });
      }
      restType = await restaurantType.create(req.body);
      return res.status(200).json({ restType });
    }
    return res
      .status(404)
      .json({ error: 'Restaurant with the specified ID does not exist!' });
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
    const existingDish = await dish.findOne({
      where: { restId, name: req.body.name },
    });
    if (existingDish) {
      return res
        .status(409)
        .json({ error: `Dish ${req.body.name} already exists!` });
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
  // const { limit, offset } = getPaiganation(req.query.page, req.query.limit);
  try {
    const dishes = await dish.findAll({ where: { restId } });
    if (!dishes) {
      return res.status(404).json({ error: 'Restaurant not found!' });
    }
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
    if (String(req.headers.id) !== String(restId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
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
  loginRestaurant,
  getRestaurant,
  updateRestaurant,
  addRestaurantType,
  deleteRestaurant,
  getRestaurants,
  createDish,
  getRestaurantDishes,
  getRestaurantDish,
  updateRestaurantDish,
  deleteRestaurantDish,
};
