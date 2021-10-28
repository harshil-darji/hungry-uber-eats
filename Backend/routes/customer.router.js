const { Router } = require('express');
const { customerController } = require('../controllers');
const {
  validate,
  customerAddressValidationRules,
} = require('../controllers/valdiationRules');

const router = Router();

/**
 * @typedef Customer
 * @property {string} emailId
 * @property {string} passwd
 * @property {string} name
 * @property {string} contactNo
 * @property {string} city
 * @property {string} state
 * @property {string} country
 * @property {string} about
 * @property {string} profileImg
 * @property {string} nickName
 * @property {string} dob
 */

/**
 * @typedef Address
 * @property {string} address
 * @property {string} city
 */

/**
 * @route GET /customers/{custId}
 * @summary Get Customer by ID
 * @group Customer - Customer operations
 * @param {string} custId.path.required
 * @returns {object} 200 - Customer details
 * @returns {Error} 404 - Customer not found
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.get('/:custId', customerController.getCustomer);

/**
 * @route PUT /customers/{custId}
 * @summary Update Customer by ID
 * @group Customer - Customer operations
 * @param {Customer.model} Customer.body
 * @param {string} custId.path.required
 * @returns {object} 200 - Customer details updated
 * @returns {Error} 404 - Customer not found
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.put('/:custId', customerController.updateCustomer);

/**
 * @route DELETE /customers/{custId}
 * @summary Delete Customer by ID
 * @group Customer - Customer operations
 * @param {string} custId.path.required
 * @returns {object} 200 - Customer account deleted
 * @returns {Error} 404 - Customer not found
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.delete('/:custId', customerController.deleteCustomer);

// Customer addresses

/**
 * Just send { address: "address1", city: "city1" }
 * @route POST /customers/{custId}/addresses
 * @summary Add customer address
 * @group Customer - Customer operations
 * @param {Address.model} Address.body
 * @param {string} custId.path.required
 * @returns {object} 200 - Address added
 * @returns {object} 401 - Unauthorized request
 * @returns {object} 400 - Address not entered
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.post(
  '/:custId/addresses',
  customerAddressValidationRules(),
  validate,
  customerController.addCustomerAddress,
);

/**
 * @route GET /customers/{custId}/addresses
 * @summary Get Customer addresses
 * @group Customer - Customer operations
 * @param {string} custId.path.required
 * @returns {object} 200 - Customer addresses
 * @returns {Error} 404 - Customer not found
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.get('/:custId/addresses', customerController.getCustomerAddresses);

/**
 * @route DELETE /customers/{custId}/addresses/{addressId}
 * @summary Delete Customer address
 * @group Customer - Customer operations
 * @param {string} custId.path.required
 * @returns {object} 200 - Deleted Customer address
 * @returns {Error} 404 - Address not found
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.delete(
  '/:custId/addresses/:addressId',
  customerController.deleteCustomerAddress,
);

module.exports = router;
