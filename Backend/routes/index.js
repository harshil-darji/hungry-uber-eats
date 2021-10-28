const { Router } = require('express');

const {
  customerController,
  orderController,
  cartController,
} = require('../controllers');

const {
  validate,
  orderValidationRules,
} = require('../controllers/valdiationRules');

const router = Router();

// Register and Login routes
router.use('/register', require('./register.router'));
router.use('/login', require('./login.router'));
router.use('/restaurants', require('./restaurant.router'));
router.use('/customers', require('./customer.router'));

// Cart routes
router.post('/customers/:custId/cart', cartController.insertIntoCart);
router.post(
  '/customers/:custId/reset-cart',
  cartController.resetCartWithDifferentRestaurant,
);
router.get('/customers/:custId/cart', cartController.viewCart);
router.get('/customers/:custId/cart-quantity', cartController.getCartQuantity);
router.put(
  '/customers/:custId/cart/:dishId',
  cartController.updateDishQuantity,
);
router.delete('/customers/:custId/clear-cart', cartController.clearCart);
router.delete('/customers/:custId/cart/:dishId', cartController.deleteFromCart);

// Order routes
router.post('/customers/:custId/orders/init', orderController.initOrder);
router.post(
  '/customers/:custId/orders/create',
  orderValidationRules(),
  validate,
  orderController.createOrder,
);
router.get('/customers/:custId/latest-order', orderController.getLatestOrder);
router.get(
  '/customers/:custId/orders/:orderId',
  orderController.getOrderDetailsById,
);
router.get('/restaurants/:restId/orders', orderController.getRestaurantOrders);
router.get('/restaurants/:restId/orders/:orderId', orderController.getRestaurantOrderDetailsById);
router.get('/customers/:custId/orders', orderController.getCustomerOrders);
router.get('/customers/:custId/orders/search/:orderStatus', orderController.getCustOrderDetailsByOrderStatus);
router.get('/restaurants/:restId/orders/search/:orderStatus', orderController.getRestOrderDetailsByOrderStatus);
router.put('/restaurants/:restId/orders/:orderId', orderController.updateOrder);

// Customer restaurant favs
router.get('/customers/:custId/favourites', customerController.getRestaurantFavs);
router.post('/customers/:custId/favourites', customerController.addRestaurantToFavs);

module.exports = router;
