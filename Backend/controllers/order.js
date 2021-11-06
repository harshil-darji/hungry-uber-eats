/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
const mongoose = require('mongoose');
const Cart = require('../models/cart');
const Restaurant = require('../models/restaurant');
const Order = require('../models/order');

const checkProperties = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
      // eslint-disable-next-line no-param-reassign
      delete obj[key];
    }
  });
};

const initOrder = async (req, res) => {
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    await Order.findOneAndDelete({
      custId: mongoose.Types.ObjectId(String(custId)),
      orderStatus: 'Initialized',
    });
    const cartItems = await Cart.findOne({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    if (!cartItems) {
      return res.status(404).json({ error: 'No items in cart!' });
    }
    const { restId } = cartItems;
    const cE = await Cart.findOne({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    const temp = [];
    cE.dishes.forEach((cartDish) => {
      temp.push({ 'dishes._id': cartDish.dishId });
    });
    const dishIdToDishQty = {};
    cE.dishes.forEach((cartDish) => {
      const dId = cartDish.dishId;
      dishIdToDishQty[dId] = cartDish.dishQuantity;
    });

    const dishes = await Restaurant.aggregate([
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
      {
        $addFields: { dishDetails: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    let price = 0;
    dishes.forEach((element) => {
      // Set dish quantity from ID to Qty object
      element.dishDetails.dishQuantity =
        dishIdToDishQty[element.dishDetails._id];
      // Set total dish price
      element.dishDetails.totalDishPrice =
        Math.round(
          (element.dishDetails.dishPrice * element.dishDetails.dishQuantity +
            Number.EPSILON) *
            100,
        ) / 100;
      // Add prices of dishes
      price += element.dishDetails.totalDishPrice;
    });

    price = Math.round((price + Number.EPSILON) * 100) / 100;

    const taxPrice = Math.round((price * 0.1 + Number.EPSILON) * 100) / 100;
    const totalOrderPrice =
      Math.round((price + taxPrice + Number.EPSILON) * 100) / 100;

    const newOrderEntry = new Order({
      custId,
      restId,
      dishes,
      orderStatus: 'Initialized',
      price,
      taxPrice,
      totalOrderPrice,
    });
    const orderEnttry = await newOrderEntry.save();
    return res.status(201).json({ orderEnttry, message: 'Order initialized!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const { orderType, orderAddress, notes } = req.body;
    const orderPlacedTime = Date.now();
    if (!orderType) {
      return res.status(400).json({ error: 'Please select order type!' });
    }
    if (orderType === 'Delivery' && orderAddress.length === 0) {
      return res.status(400).json({ error: 'Please enter your address!' });
    }
    const cartItems = await Cart.findOne({
      custId: mongoose.Types.ObjectId(String(custId)),
    });
    if (!cartItems) {
      return res.status(404).json({
        error: 'No such order! Add items to cart and checkout first.',
      });
    }
    await Cart.findOneAndDelete({
      custId: mongoose.Types.ObjectId(String(custId)),
    });

    const latestOrder = await Order.find({
      custId: mongoose.Types.ObjectId(String(custId)),
      orderStatus: 'Initialized',
    })
      .limit(1)
      .sort({ $natural: -1 });

    if (!latestOrder.length) {
      return res.status(400).json({ error: 'No such order!' });
    }

    const toUpdateObj = {
      orderPlacedTime,
      orderStatus: 'Placed',
      notes,
      orderAddress,
      orderType,
    };
    checkProperties(toUpdateObj);

    if (orderType === 'Delivery') {
      toUpdateObj.totalOrderPrice =
        Math.round(
          (latestOrder[0].totalOrderPrice + 0.49 + Number.EPSILON) * 100,
        ) / 100;
    }

    const updatedOrder = await Order.updateOne(
      {
        custId: mongoose.Types.ObjectId(String(custId)),
        orderStatus: 'Initialized',
      },
      {
        $set: toUpdateObj,
      },
      { new: true, multi: true },
    );

    return res.status(200).json({
      updatedOrder,
      message: 'Order placed successfully!',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getLatestOrder = async (req, res) => {
  try {
    const { custId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const latestOrder = await Order.find({
      custId: mongoose.Types.ObjectId(String(custId)),
      orderStatus: 'Initialized',
    })
      .limit(1)
      .sort({ $natural: -1 })
      .populate({ path: 'restId', select: { dishes: 0 } });

    if (!latestOrder.length) {
      return res.status(400).json({ error: 'No such order!' });
    }
    return res.status(200).json({ latestOrder: latestOrder[0] });
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
    const orders = await Order.find({
      restId: mongoose.Types.ObjectId(String(restId)),
    })
      .sort({ $natural: -1 })
      .populate({ path: 'restId', select: { dishes: 0 } });

    return res.json({ orders });
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

    const orders = await Order.find({
      custId: mongoose.Types.ObjectId(String(custId)),
    })
      .sort({ $natural: -1 })
      .populate({ path: 'restId' });

    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const cancelOrderByCustomer = async (req, res) => {
  try {
    const { custId, orderId } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const order = await Order.findById(orderId);
    if (order.orderStatus !== 'Initialized' && order.orderStatus !== 'Placed') {
      return res.status(400).json({ error: 'Cannot cancel order now!' });
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(String(orderId)) },
      {
        $set: { orderStatus: 'Cancelled' },
      },
    );
    return res.status(200).json({ message: 'Order cancelled!', updatedOrder });
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
    const orderDetails = await Order.findOne({
      _id: mongoose.Types.ObjectId(String(orderId)),
      custId: mongoose.Types.ObjectId(String(custId)),
    })
      .sort({ $natural: -1 })
      .populate({ path: 'restId' });

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
    const orderDetails = await Order.findOne({
      _id: mongoose.Types.ObjectId(String(orderId)),
      custId: mongoose.Types.ObjectId(String(restId)),
    })
      .sort({ $natural: -1 })
      .populate({ path: 'restId' });

    return res.status(200).json({ orderDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRestOrderDetailsByOrderStatus = async (req, res) => {
  try {
    const { restId, orderStatus } = req.params;
    if (String(req.headers.id) !== String(restId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const orderDetails = await Order.find({
      _id: mongoose.Types.ObjectId(String(restId)),
      orderStatus: mongoose.Types.ObjectId(String(orderStatus)),
    })
      .sort({ $natural: -1 })
      .populate({ path: 'restId' });

    return res.status(200).json({ orderDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCustOrderDetailsByOrderStatus = async (req, res) => {
  try {
    const { custId, orderStatus } = req.params;
    if (String(req.headers.id) !== String(custId)) {
      return res.status(401).json({ error: 'Unauthorized request!' });
    }
    const orders = await Order.find({
      custId: mongoose.Types.ObjectId(String(custId)),
      orderStatus,
    })
      .sort({ $natural: -1 })
      .populate({ path: 'restId' });

    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  initOrder,
  createOrder,
  getLatestOrder,
  cancelOrderByCustomer,
  getRestaurantOrders,
  getCustomerOrders,
  getOrderDetailsById,
  getRestaurantOrderDetailsById,
  getRestOrderDetailsByOrderStatus,
  getCustOrderDetailsByOrderStatus,
};
