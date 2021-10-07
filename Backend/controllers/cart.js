/* eslint-disable object-curly-newline */
const {
  cart,
  restaurant,
  dish,
  sequelize,
  dishImages,
} = require('../models/data-model');

const insertIntoCart = async (req, res) => {
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const { restId, dishId } = req.body;
    // If restaurant ID or Dish ID is not sent
    if (!restId) {
      return res.status(400).json({ error: 'Please select restaurant!' });
    }
    if (!dishId) {
      return res.status(400).json({ error: 'Please select dish!' });
    }
    const checkExistingRest = await restaurant.findOne({
      where: { restId },
    });
    // Check if restaurant ID or Dish ID exists in database
    if (!checkExistingRest) {
      return res.status(404).json({ error: 'Restaurant not found!' });
    }
    const checkExistingDish = await dish.findOne({
      where: { dishId, restId },
    });
    if (!checkExistingDish) {
      return res.status(404).json({ error: 'Dish not found!' });
    }
    const latestCartEntry = await cart.findOne({
      where: { custId },
      order: [['createdAt', 'DESC']],
    });
    if (!latestCartEntry) {
      req.body.custId = custId;
      const cartEntry = await cart.create(req.body);
      return res.status(201).json({
        cartEntry,
      });
    }
    // If added into cart from different restaurant
    if (latestCartEntry.restId !== restId) {
      // const newDishInfo = await dish.findOne({
      //   where: { dishId },
      // });
      return res.status(200).json({
        message: 'Create new order?',
        ...req.body,
        newRestId: restId,
        oldRestId: latestCartEntry.restId,
      });
    }
    // Else add into cart
    req.body.custId = custId;
    const cartEntry = await cart.create(req.body);
    return res.status(201).json({
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
    const deleteAllCartItems = await cart.destroy({
      where: { custId },
    });
    if (!deleteAllCartItems) {
      return res
        .status(500)
        .json({ error: 'Server error! Could not reset cart!' });
    }
    const { restId, dishId } = req.body;
    // If restaurant ID or Dish ID is not sent
    if (!restId) {
      return res.status(400).json({ error: 'Please select restaurant!' });
    }
    if (!dishId) {
      return res.status(400).json({ error: 'Please select dish!' });
    }
    const checkExistingRest = await restaurant.findOne({
      where: { restId },
    });
    // Check if restaurant ID or Dish ID exists in database
    if (!checkExistingRest) {
      return res.status(404).json({ error: 'Restaurant not found!' });
    }
    const checkExistingDish = await dish.findOne({
      where: { dishId, restId },
    });
    if (!checkExistingDish) {
      return res.status(404).json({ error: 'Dish not found!' });
    }
    // Add new dish from different restaurant
    req.body.custId = custId;
    const cartEntry = await cart.create(req.body);
    return res.status(201).json({
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
    const cartItems = await cart.findAll({
      attributes: [
        [sequelize.fn('count', sequelize.col('dish.dishId')), 'dishCount'],
      ],
      include: [
        {
          model: dish,
        },
      ],
      required: false,
      where: { custId },
      group: ['cart.dishId'],
    });
    if (cartItems.length === 0) {
      return res.status(200).json([]);
    }
    const cartDishImages = await cart.findAll({
      attributes: ['dishId'],
      include: [
        {
          model: dish,
          attributes: ['dishId'],
          include: [{ model: dishImages }],
        },
      ],
    });
    const { restId } = cartItems[0].dish;
    const rest = await restaurant.findOne({
      where: { restId },
      attributes: { exclude: ['createdAt', 'updatedAt', 'passwd'] },
    });
    return res.status(200).json({ cartItems, rest, cartDishImages });
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
    const checkExistingDish = await cart.findOne({
      where: { dishId },
    });
    if (!checkExistingDish) {
      return res.status(404).json({ error: 'No dish found in cart!' });
    }
    const deletedCartItem = await cart.destroy({
      where: { custId, dishId },
    });
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
    const deletedCartItems = await cart.destroy({
      where: { custId },
    });
    if (deletedCartItems) {
      return res.status(200).json({ message: 'Cart cleared successfully!' });
    }
    return res.status(404).json({ error: 'Cart could not be cleared!' });
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
    const cartItems = await cart.findAll({
      where: { custId },
    });
    if (cartItems.length > 0) {
      return res.status(200).json({ totalDishesInCart: cartItems.length });
    }
    return res.status(200).json({ totalDishesInCart: 0 });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateDishQuantity = async (req, res) => {
  try {
    const { custId, dishId } = req.params;
    const { restId, dishCount } = req.body;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    await cart.destroy({
      where: { custId, dishId },
    });
    // eslint-disable-next-line no-unused-vars
    const cartRows = [...Array(dishCount)].map((_, i) => ({
      restId,
      dishId,
      custId,
    }));
    await cart.bulkCreate(cartRows);

    return res.status(200).json({ dishCount: cartRows.length });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  insertIntoCart,
  viewCart,
  deleteFromCart,
  getCartQuantity,
  updateDishQuantity,
  clearCart,
  resetCartWithDifferentRestaurant,
};
