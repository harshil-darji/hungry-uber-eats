const { Router } = require('express');

const controllers = require('../controllers');
const { credentialsValidationRules, validate } = require('../controllers/credentialValidator');

const router = Router();

// Root route
router.get('/', (req, res) => res.send('This is root!'));

// Customer routes
router.post(
  '/customer',
  credentialsValidationRules(),
  validate,
  controllers.customerController.createCustomer,
);
router.get('/customer/:custId', controllers.customerController.getCustomer);
router.put('/customer/:custId', controllers.customerController.updateCustomer);
router.delete('/customer/:custId', controllers.customerController.deleteCustomer);

// Restaurant routes
router.post(
  '/restaurant',
  credentialsValidationRules(),
  validate,
  controllers.restaurantController.createRestaurant,
);
router.get('/restaurants', controllers.restaurantController.getRestaurants);
router.get('/restaurant/:restId', controllers.restaurantController.getRestaurant);
router.put('/restaurant/:restId', controllers.restaurantController.updateRestaurant);
router.delete('/restaurant/:restId', controllers.restaurantController.deleteRestaurant);
// Restaurant Dishes routes
router.post('/restaurant/:restId/dish', controllers.restaurantController.createDish);
router.get('/restaurant/:restId/dishes', controllers.restaurantController.getRestaurantDishes);
router.get(
  '/restaurant/:restId/dishes/:dishId',
  controllers.restaurantController.getRestaurantDish,
);
router.put(
  '/restaurant/:restId/dishes/:dishId',
  controllers.restaurantController.updateRestaurantDish,
);
router.delete(
  '/restaurant/:restId/dishes/:dishId',
  controllers.restaurantController.deleteRestaurantDish,
);

module.exports = router;
