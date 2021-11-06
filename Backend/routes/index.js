const { Router } = require('express');

const router = Router();

// All main routes
router.use('/register', require('./register.router'));
router.use('/login', require('./login.router'));
router.use('/restaurants', require('./restaurant.router'));
router.use('/customers', require('./customer.router'));

module.exports = router;
