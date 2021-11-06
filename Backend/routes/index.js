const { Router } = require('express');

const { customerController } = require('../controllers');

const router = Router();

// Register and Login routes
router.use('/register', require('./register.router'));
router.use('/login', require('./login.router'));
router.use('/restaurants', require('./restaurant.router'));
router.use('/customers', require('./customer.router'));

// Customer restaurant favs
router.get(
  '/customers/:custId/favourites',
  customerController.getRestaurantFavs,
);
router.post(
  '/customers/:custId/favourites',
  customerController.addRestaurantToFavs,
);

module.exports = router;
