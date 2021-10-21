const { Router } = require('express');
const { customerController, restaurantController } = require('../controllers');

const router = Router();

/**
 * @typedef CheckLogin
 * @property {string} emailId.required
 */

/**
 * @typedef Login
 * @property {string} emailId.required
 * @property {string} passwd.required
 */

/**
 * @route POST /login/email
 * @summary Check if email already exists for login
 * @group Login - Login operations
 * @param {CheckLogin.model} LoginModel.body.required - Email
 * @returns {string} 200 - If email already exists
 * @returns {Error}  400 - Email doesn't exist
 * @returns {Error}  500 - Server error
 */
router.post('/email', customerController.checkLoginEmail); // check email exists for login

/**
 * This function comment is parsed by doctrine
 * @route POST /login/customers
 * @summary Login customer
 * @group Login - Login operations
 * @param {Login.model} Login.body.required
 * @returns {object} 200 - Login Successful
 * @returns {Error}  401 - Invalid password / All fields not entered
 * @returns {Error}  404 - Email not found
 * @returns {Error}  500 - Server error
 */
router.post('/customers', customerController.loginCustomer);

/**
 * This function comment is parsed by doctrine
 * @route POST /login/restaurants
 * @summary Login Restaurant
 * @group Login - Login operations
 * @param {Login.model} Login.body.required
 * @returns {string} 200 - Login Successful
 * @returns {Error}  401 - Invalid password / All fields not entered
 * @returns {Error}  404 - Email not found
 * @returns {Error}  500 - Server error
 */
router.post('/restaurants', restaurantController.loginRestaurant);

module.exports = router;
