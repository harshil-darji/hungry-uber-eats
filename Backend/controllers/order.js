/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
const {
  cart,
  dish,
  sequelize,
  order,
  orderDishes,
  restaurant,
  restaurantImages,
  restaurantType,
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
    const taxPrice = Math.round(0.06 * price * 100) / 100;
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
    if (orderType === 'Delivery' && orderAddress.length === 0) {
      return res.status(400).json({ error: 'Please enter your address!' });
    }
    const latestOrder = await order.findOne({
      where: { custId },
      order: [['createdAt', 'DESC']],
    });
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
    await cart.destroy({
      where: { custId },
      transaction: t,
    });
    await order.destroy({
      where: {
        custId,
        orderStatus: 'Initialized',
      },
      transaction: t,
    });
    await t.commit();
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
        {
          model: restaurant,
          include: [
            {
              model: restaurantImages,
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
            {
              model: restaurantType,
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    if (!latestOrder) {
      return res.status(400).json({ error: 'No items in cart!' });
    }
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
    // eslint-disable-next-line no-unused-vars
    const [orderDishCounts, m2] = await sequelize.query(
      `select count(*) as totalDishCount, orders.orderId from orders join restaurants on orders.restId = restaurants.restId join restaurantImages on restaurantImages.restId = restaurants.restId join orderDishes on orders.orderId = orderDishes.orderId where orders.restId=${restId} group by orders.orderId;`,
    );
    // eslint-disable-next-line no-unused-vars
    const [orderDetails, m3] = await sequelize.query(
      `select customers.name, customers.custId, customers.profileImg, orders.orderId, orders.totalPrice, orders.orderPlacedTime, orders.orderStatus, orders.orderType from orders join customers on orders.custId = customers.custId join orderDishes on orders.orderId = orderDishes.orderId where orders.restId=${restId} group by orders.orderId, orders.orderPlacedTime, customers.name, orders.totalPrice, customers.profileImg, orders.orderStatus, orders.orderType, customers.custId`,
    );
    // const restaurantOrders = await order.findAll({
    //   where: { restId },
    //   include: [{ model: orderDishes, include: [{ model: dish }] }],
    //   order: [['createdAt', 'DESC']],
    // });
    return res.json({ orderDetails, orderDishCounts });
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

    // const oIDs = await order.findAll({
    //   where: { custId },
    //   attributes: ['orderId'],
    // });
    // const orderIDs = oIDs.map((oID) => oID.orderId);
    // const customerOrderDishes = await orderDishes.findAll({
    //   attributes: [
    //     [sequelize.fn('count', sequelize.col('dish.dishId')), 'dishCount'],
    //   ],
    //   include: [
    //     {
    //       model: dish,
    //     },
    //   ],
    //   required: false,
    //   where: { orderId: orderIDs },
    //   group: ['orderDishes.dishId'],
    // });
    // const customerOrders = await order.findAll({
    //   where: { custId },
    //   include: [
    //     {
    //       model: orderDishes,
    //       include: [{ model: dish }],
    //     },
    //   ],
    //   order: [['createdAt', 'DESC']],
    // });
    // eslint-disable-next-line no-unused-vars
    // const [customerOrders, m1] = await sequelize.query(
    //   'SELECT dishes.*, orders.*, restaurants.*, COUNT(orderDishes.dishId) as dishCount FROM orderDishes JOIN dishes on orderDishes.dishId=dishes.dishId JOIN restaurants on restaurants.restId=dishes.restId JOIN orders on orderDishes.orderId = orders.orderId GROUP BY orderDishes.dishId, orders.orderId;',
    // );
    // eslint-disable-next-line no-unused-vars
    const [orderDishCounts, m2] = await sequelize.query(
      `select count(*) as totalDishCount, orders.orderId from orders join restaurants on orders.restId = restaurants.restId join restaurantImages on restaurantImages.restId = restaurants.restId join orderDishes on orders.orderId = orderDishes.orderId where orders.custId=${custId} group by orders.orderId;`,
    );
    // eslint-disable-next-line no-unused-vars
    const [orderDetails, m3] = await sequelize.query(
      `select restaurants.name, restaurantImages.imageLink, restaurantImages.restId, orders.orderId, orders.totalPrice, orders.orderPlacedTime from orders join restaurants on orders.restId = restaurants.restId join restaurantImages on restaurantImages.restId = restaurants.restId join orderDishes on orders.orderId = orderDishes.orderId where orders.custId=${custId} group by orders.orderId, orders.orderPlacedTime, restaurantImages.imageLink, restaurantImages.restId, restaurants.name, orders.totalPrice;`,
    );
    return res.json({ orderDishCounts, orderDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { restId, orderId } = req.params;
    if (String(req.headers.id) !== String(restId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const { orderStatus } = req.body;
    if (!orderStatus) {
      return res
        .status(400)
        .json({ error: 'Please specify updated order status!' });
    }
    if (!orderId) {
      return res.status(400).json({ error: 'Order not found!' });
    }
    const updatedOrder = await order.update(
      {
        orderStatus,
      },
      {
        where: { orderId },
      },
    );
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
    // eslint-disable-next-line no-unused-vars
    const [orderDetails, m1] = await sequelize.query(
      `SELECT dishes.*, orders.*, COUNT(orderDishes.dishId) as dishCount FROM orderDishes JOIN dishes on orderDishes.dishId=dishes.dishId JOIN restaurants on restaurants.restId=dishes.restId JOIN restaurantImages on restaurants.restId=restaurantImages.restId JOIN orders on orderDishes.orderId = orders.orderId WHERE orders.orderId=${orderId} AND orders.custId=${custId} GROUP BY orderDishes.dishId, orders.orderId, restaurantImages.imageLink;`,
    );
    return res.status(200).json({ orderDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRestaurantOrderDetailsById = async (req, res) => {
  try {
    const { orderId, restId } = req.params;
    if (String(req.headers.id) !== String(restId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    // eslint-disable-next-line no-unused-vars
    const [orderDetails, m1] = await sequelize.query(
      `SELECT dishes.*, orders.*, COUNT(orderDishes.dishId) as dishCount FROM orderDishes JOIN dishes on orderDishes.dishId=dishes.dishId JOIN restaurants on restaurants.restId=dishes.restId JOIN restaurantImages on restaurants.restId=restaurantImages.restId JOIN orders on orderDishes.orderId = orders.orderId WHERE orders.orderId=${orderId} AND orders.restId=${restId} GROUP BY orderDishes.dishId, orders.orderId, restaurantImages.imageLink;`,
    );
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
  getRestaurantOrderDetailsById,
};
