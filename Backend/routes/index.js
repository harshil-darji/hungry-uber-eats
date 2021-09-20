const { Router } = require('express');

const {
  customerController,
  restaurantController,
  orderController,
  cartController,
} = require('../controllers');

const {
  customerRegistrationValidationRules,
  restaurantRegistrationValidationRules,
  dishValidationRules,
  validate,
  orderValidationRules,
  customerAddressValidationRules,
} = require('../controllers/valdiationRules');

const router = Router();

// Root route
router.get('/', (req, res) => res.send('This is root!'));

// Register and Login routes
router.post(
  '/register/customers',
  customerRegistrationValidationRules(),
  validate,
  customerController.createCustomer,
);
router.post(
  '/register/restaurants',
  restaurantRegistrationValidationRules(),
  validate,
  restaurantController.createRestaurant,
);
router.post('/login/customers', customerController.loginCustomer);
router.post(
  '/login/restaurants',
  restaurantController.loginRestaurant,
);

router.get('/customers/:custId', customerController.getCustomer);
router.put('/customers/:custId', customerController.updateCustomer);
router.delete(
  '/customers/:custId',
  customerController.deleteCustomer,
);

// Restaurant routes
router.get('/restaurants', restaurantController.getRestaurants);
router.get(
  '/restaurants/:restId',
  restaurantController.getRestaurant,
);
router.put(
  '/restaurants/:restId',
  restaurantController.updateRestaurant,
);
router.delete(
  '/restaurants/:restId',
  restaurantController.deleteRestaurant,
);
// Restaurant Dishes routes
router.post(
  '/restaurants/:restId/dishes',
  dishValidationRules(),
  validate,
  restaurantController.createDish,
);
router.get(
  '/restaurants/:restId/dishes',
  restaurantController.getRestaurantDishes,
);
router.get(
  '/restaurants/:restId/dishes/:dishId',
  restaurantController.getRestaurantDish,
);
router.put(
  '/restaurants/:restId/dishes/:dishId',
  restaurantController.updateRestaurantDish,
);
router.delete(
  '/restaurants/:restId/dishes/:dishId',
  restaurantController.deleteRestaurantDish,
);

// Cart routes
router.post('/customers/:custId/cart', cartController.insertIntoCart);
router.post(
  '/customers/:custId/reset-cart',
  cartController.resetCartWithDifferentRestaurant,
);
router.get('/customers/:custId/cart', cartController.viewCart);
router.delete(
  '/customers/:custId/cart/:dishId',
  cartController.deleteFromCart,
);

// Order routes
router.post(
  '/customers/:custId/orders/init',
  orderController.initOrder,
);
router.post(
  '/customers/:custId/orders/create',
  orderValidationRules(),
  validate,
  orderController.createOrder,
);
router.get('/customers/:custId/latestOrder', orderController.getLatestOrder);
router.get(
  '/customers/:custId/orders/:orderId',
  orderController.getOrderDetailsById,
);
router.get(
  '/restaurants/:restId/orders',
  orderController.getRestaurantOrders,
);
router.get(
  '/customers/:custId/orders',
  orderController.getCustomerOrders,
);

// Customer addresses
router.post(
  '/customers/:custId/addresses',
  customerAddressValidationRules(),
  validate,
  customerController.addCustomerAddress,
);
router.get(
  '/customers/:custId/addresses',
  customerController.getCustomerAddresses,
);

module.exports = router;
