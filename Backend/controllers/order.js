/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
const {
  cart,
  dish,
  sequelize,
  order,
  orderDishes,
} = require('../models/data-model');

const initOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const cartItems = await cart.findAll(
      {
        attributes: ['dishId', 'restId'],
        where: { custId },
      },
      { transaction: t },
    );
    if (cartItems.length === 0) {
      return res.status(404).json({ error: 'No items in cart!' });
    }
    const { restId } = cartItems[0];
    const dishIdAndQty = {};
    cartItems.forEach((cartItem) => {
      dishIdAndQty[cartItem.dishId] = dishIdAndQty[cartItem.dishId]
        ? dishIdAndQty[cartItem.dishId] + 1
        : 1;
    });
    const dishDetails = await dish.findAll(
      {
        attributes: ['dishId', 'dishPrice'],
        where: { dishId: Object.keys(dishIdAndQty) },
      },
      { transaction: t },
    );
    let price = 0;
    dishDetails.forEach((dishD) => {
      price += dishD.dishPrice * dishIdAndQty[dishD.dishId];
    });
    const taxPrice = Math.round(0.02 * price * 100) / 100;
    const totalPrice = Math.round((price + taxPrice) * 100) / 100;
    const orderEntry = await order.create(
      {
        price,
        taxPrice,
        totalPrice,
        custId,
        restId,
        orderStatus: 'Initialized',
      },
      { transaction: t },
    );
    t.commit();
    return res.status(200).json({ orderEntry, message: 'Order initialized!' });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const { orderType, orderAddress } = req.body;
    const orderPlacedTime = Date.now();
    if (!orderType) {
      return res.status(400).json({ error: 'Please select order type!' });
    }
    if (orderType === 'Delivery' && !orderAddress) {
      return res.status(400).json({ error: 'Please enter your address!' });
    }
    const latestOrder = await order.findOne({
      where: { custId },
      order: [['createdAt', 'DESC']],
    });
    // TODO: before placing the order, make sure to clear all previously INITIALIZED orders
    const updatedOrder = await order.update(
      { ...req.body, orderPlacedTime, orderStatus: 'Placed' },
      {
        where: { orderId: latestOrder.orderId },
      },
      { transaction: t },
    );
    const cartItems = await cart.findAll(
      {
        attributes: ['dishId'],
        where: { custId },
      },
      { transaction: t },
    );
    if (cartItems.length === 0) {
      return res.status(404).json({ error: 'No items in cart!' });
    }
    cartItems.forEach(async (cartItem) => {
      await orderDishes.create(
        {
          dishId: cartItem.dishId,
          orderId: latestOrder.orderId,
        },
        {
          transaction: t,
        },
      );
    });
    await cart.destroy(
      {
        where: { custId },
      },
      { transaction: t },
    );
    t.commit();
    return res.status(200).json({
      updatedOrder,
      message: 'Order placed successfully!',
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ error: error.message });
  }
};

const getLatestOrder = async (req, res) => {
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const latestOrder = await order.findOne({
      where: { custId },
      include: [
        {
          model: orderDishes,
          attributes: { exclude: ['createdAt', 'updatedAt', 'orderId'] },
          include: [
            {
              model: dish,
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    const orderDishesInfo = {};
    latestOrder.orderDishes.forEach((orderDish) => {
      if (!orderDishesInfo.hasOwnProperty(String(orderDish.dishId))) {
        const temp = { ...orderDish.dish.dataValues, qty: 1 };
        // orderDish.qty = 1;
        orderDishesInfo[orderDish.dishId] = temp;
      } else {
        orderDishesInfo[orderDish.dishId].qty += 1;
      }
    });
    const orderDishesArray = [];
    Object.keys(orderDishesInfo).forEach((key) => {
      orderDishesArray.push(orderDishesInfo[key]);
    });
    return res
      .status(200)
      .json({ latestOrder, orderDishesInfo: orderDishesArray });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRestaurantOrders = async (req, res) => {
  try {
    const { restId } = req.params;
    if (String(req.headers.id) !== String(restId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const restaurantOrders = await order.findAll({
      where: { restId },
      include: [{ model: orderDishes, include: [{ model: dish }] }],
      order: [['createdAt', 'DESC']],
    });
    return res.json({ restaurantOrders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCustomerOrders = async (req, res) => {
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const customerOrders = await order.findAll({
      where: { custId },
      include: [{ model: orderDishes, include: [{ model: dish }] }],
      order: [['createdAt', 'DESC']],
    });
    return res.json({ customerOrders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { restId } = req.params;
    if (String(req.headers.id) !== String(restId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const { orderStatus, orderId } = req.body;
    if (!orderStatus) {
      return res
        .status(400)
        .json({ error: 'Please specify updated order status!' });
    }
    if (!orderId) {
      return res.status(400).json({ error: 'Order not found!' });
    }
    const updatedOrder = await order.update({
      orderStatus,
      where: { orderId },
    });
    return res
      .status(200)
      .json({ message: 'Order status updated!', updatedOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getOrderDetailsById = async (req, res) => {
  try {
    const { orderId, custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const orderDetails = await order.findAll({
      where: { custId, orderId },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ orderDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  initOrder,
  createOrder,
  getLatestOrder,
  updateOrder,
  getRestaurantOrders,
  getCustomerOrders,
  getOrderDetailsById,
};
