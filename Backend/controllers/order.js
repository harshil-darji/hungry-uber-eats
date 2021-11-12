/* eslint-disable camelcase */
/* eslint-disable operator-linebreak */
const mongoose = require('mongoose');
// const Cart = require('../models/cart');
// const Restaurant = require('../models/restaurant');
const Order = require('../models/order');
const { make_request } = require('../kafka/client');

const initOrder = async (req, res) => {
  make_request(
    'order.init',
    { ...req.params, id: req.headers.id },
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

const createOrder = async (req, res) => {
  make_request(
    'order.create',
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
      .populate({ path: 'custId', select: { dishes: 0 } });

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
    const { page = 1, limit = 5, orderStatus } = req.query;

    let orders = [];
    let count;
    if (orderStatus) {
      orders = await Order.find({
        custId: mongoose.Types.ObjectId(String(custId)),
        orderStatus,
      });
      count = orders.length;

      orders = await Order.find({
        custId: mongoose.Types.ObjectId(String(custId)),
        orderStatus,
      })
        .sort({ $natural: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate({ path: 'restId' });
    } else {
      const custOrders = await Order.find({
        custId: mongoose.Types.ObjectId(String(custId)),
      });
      count = custOrders.length;

      orders = await Order.find({
        custId: mongoose.Types.ObjectId(String(custId)),
      })
        .sort({ $natural: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate({ path: 'restId' });
    }
    return res.json({
      orders,
      totalDocuments: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const cancelOrderByCustomer = async (req, res) => {
  make_request(
    'order.cancel',
    { ...req.params, id: req.headers.id },
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

const updateOrderByRestaurant = async (req, res) => {
  make_request(
    'order.update',
    { ...req.params, body: req.body, id: req.headers.id },
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
      restId: mongoose.Types.ObjectId(String(restId)),
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
    const orders = await Order.find({
      restId: mongoose.Types.ObjectId(String(restId)),
      orderStatus,
    })
      .sort({ $natural: -1 })
      .populate({ path: 'restId custId' });

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  initOrder,
  createOrder,
  getLatestOrder,
  cancelOrderByCustomer,
  updateOrderByRestaurant,
  getRestaurantOrders,
  getCustomerOrders,
  getOrderDetailsById,
  getRestaurantOrderDetailsById,
  getRestOrderDetailsByOrderStatus,
};
