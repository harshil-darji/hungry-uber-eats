const { Router } = require('express');
const { customerController, restaurantController } = require('../controllers');
const {
  customerRegistrationValidationRules,
  restaurantRegistrationValidationRules,
  validate,
} = require('../controllers/valdiationRules');

const router = Router();

/**
 * @typedef CheckLogin
 * @property {string} emailId.required
 */

/**
 * @typedef RegisterCustomer
 * @property {string} emailId.required
 * @property {string} passwd.required
 * @property {string} name.required
 * @property {string} contactNo.required
 */

/**
 * @typedef RegisterRestaurant
 * @property {string} emailId.required
 * @property {string} passwd.required
 * @property {string} name.required
 */

/**
 * @route POST /register/email
 * @summary Check if email is already registered for customer
 * @group Register - Register operations
 * @param {CheckLogin.model} LoginModel.body.required
 * @returns {string} 200 - Email valid for registration
 * @returns {Error}  409 - Email already exists. Sign in
 * @returns {Error}  500 - Server error
 */
router.post('/email', customerController.checkEmail); // check email doesnt already exist in db

/**
 * @route POST /register/customers
 * @summary Register new customer
 * @group Register - Register operations
 * @param {RegisterCustomer.model} RegisterCustomer.body.required
 * @returns {string} 201 - Customer registered
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Server error
 */
router.post(
  '/customers',
  customerRegistrationValidationRules(),
  validate,
  customerController.createCustomer,
);

/**
 * @route POST /register/restaurants
 * @summary Register new restaurant
 * @group Register - Register operations
 * @param {RegisterRestaurant.model} RegisterRestaurant.body.required
 * @returns {string} 201 - Restaurant registered
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Server error
 */
router.post(
  '/restaurants',
  restaurantRegistrationValidationRules(),
  validate,
  restaurantController.createRestaurant,
);

module.exports = router;
