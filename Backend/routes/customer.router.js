const { Router } = require('express');
const {
  customerController,
  cartController,
  orderController,
} = require('../controllers');
const {
  validate,
  customerAddressValidationRules,
  orderValidationRules,
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
 * @typedef RestId
 * @property {string} restId
 */

/**
 * @typedef Address
 * @property {string} address
 * @property {string} city
 */

/**
 * @typedef CartEntry
 * @property {object} dishes
 * @property {string} restId
 */

/**
 * @typedef ResetCart
 * @property {string} restId
 * @property {string} dishId
 */

/**
 * @typedef OrderEntry
 * @property {string} notes
 * @property {string} orderType
 * @property {string} orderAddress
 */

// /**
//  * @route GET /customers/{custId}
//  * @summary Get Customer by ID
//  * @group Customer - Customer operations
//  * @param {string} custId.path.required
//  * @returns {object} 200 - Customer details
//  * @returns {Error} 404 - Customer not found
//  * @returns {Error}  500 - Server error
//  * @security JWT
//  */
// router.get('/:custId', customerController.getCustomer);

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

/* ********************************  CUSTOMER ADDRESSES ******************************* */

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

/* ********************************  CUSTOMER CART ******************************* */

/**
 * @route POST /customers/{custId}/cart
 * @summary Add item to cart
 * @group Cart - Cart operations
 * @param {CartEntry.model} CartEntry.body.required dishes: { dishId: "", dishQuantity: 1 }
 * @param {string} custId.path.required
 * @returns {object} 200 - Item added to cart
 * @returns {object} 400 - Dish/Restaurant not specified
 * @returns {object} 400 - Address not entered
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.post('/:custId/cart', cartController.insertIntoCart);

/**
 * @route POST /customers/{custId}/reset-cart
 * @summary Reset cart with different restaurant
 * @group Cart - Cart operations
 * @param {ResetCart.model} ResetCart.body.required
 * @param {string} custId.path.required
 * @returns {object} 200 - Item added to cart
 * @returns {object} 400 - Dish/Restaurant not specified
 * @returns {object} 400 - Address not entered
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.post(
  '/:custId/reset-cart',
  cartController.resetCartWithDifferentRestaurant,
);

/**
 * @route GET /customers/{custId}/cart
 * @summary Get cart items
 * @group Cart - Cart operations
 * @param {string} custId.path.required
 * @returns {object} 200 - Cart items
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.get('/:custId/cart', cartController.viewCart);

/**
 * @route GET /customers/{custId}/cart-quantity
 * @summary Get cart items total quantity
 * @group Cart - Cart operations
 * @param {string} custId.path.required
 * @returns {object} 200 - Cart quantity
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.get('/:custId/cart-quantity', cartController.getCartQuantity);

/**
 * @route DELETE /customers/{custId}/clear-cart
 * @summary Clear cart for customer
 * @group Cart - Cart operations
 * @param {string} custId.path.required
 * @returns {object} 200 - Cart cleared
 * @returns {Error} 404 - No items in cart
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.delete('/:custId/clear-cart', cartController.clearCart);

/**
 * @route DELETE /customers/{custId}/cart/{dishId}
 * @summary Delete dish from cart
 * @group Cart - Cart operations
 * @param {string} custId.path.required
 * @param {string} dishId.path.required
 * @returns {object} 200 - Removed from cart
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.delete('/:custId/cart/:dishId', cartController.deleteFromCart);

/* ******************************  CUSTOMER ORDERS ******************************* */

/**
 * @route POST /customers/{custId}/orders/init
 * @summary Initialize order
 * @group Order - Order operations
 * @param {string} custId.path.required
 * @returns {object} 200 - Order initialized
 * @returns {Error} 500 - Server error
 * @security JWT
 */
router.post('/:custId/orders/init', orderController.initOrder);

/**
 * @route POST /customers/{custId}/orders/create
 * @summary Create order
 * @group Order - Order operations
 * @param {OrderEntry.model} OrderEntry.body
 * @param {string} custId.path.required
 * @returns {object} 200 - Order create
 * @returns {Error} 404 - No items in cart
 * @returns {Error} 400 - No such order
 * @returns {Error} 500 - Server error
 * @security JWT
 */
router.post(
  '/:custId/orders/create',
  orderValidationRules(),
  validate,
  orderController.createOrder,
);

/**
 * @route GET /customers/{custId}/latest-order
 * @summary Get latest order
 * @group Order - Order operations
 * @param {string} custId.path.required
 * @returns {object} 200 - Latest order
 * @returns {Error} 400 - No items in cart
 * @returns {Error} 500 - Server error
 * @security JWT
 */
router.get('/:custId/latest-order', orderController.getLatestOrder);

/**
 * @route GET /customers/{custId}/orders/{orderId}
 * @summary Get order by ID
 * @group Order - Order operations
 * @param {string} custId.path.required
 * @param {string} orderId.path.required
 * @returns {object} 200 - Order
 * @returns {Error} 500 - Server error
 * @security JWT
 */
router.get('/:custId/orders/:orderId', orderController.getOrderDetailsById);

/**
 * @route GET /customers/{custId}/orders
 * @summary Get all customer orders
 * @group Order - Order operations
 * @param {string} custId.path.required
 * @param {string} page.query
 * @param {string} limit.query
 * @returns {object} 200 - Orders
 * @returns {Error} 500 - Server error
 * @security JWT
 */
router.get('/:custId/orders', orderController.getCustomerOrders);

/**
 * @route PUT /customers/{custId}/orders/{orderId}
 * @summary Cancel order by order ID
 * @group Order - Order operations
 * @param {string} custId.path.required
 * @param {string} orderId.path.required
 * @returns {object} 200 - Order cancelled
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.put('/:custId/orders/:orderId', orderController.cancelOrderByCustomer);

/* ******************************  CUSTOMER FAV RESTAURANTS ******************************* */

/**
 * @route POST /customers/{custId}/favourites
 * @summary Add restaurant to favourites
 * @group Customer - Customer operations
 * @param {RestId.model} RestId.body.required
 * @param {string} custId.path.required
 * @returns {object} 200 - Restaurant added to favourites
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.post('/:custId/favourites', customerController.addRestaurantToFavs);

/**
 * @route GET /customers/{custId}/favourites
 * @summary Get customer favourite restaurants
 * @group Customer - Customer operations
 * @param {string} custId.path.required
 * @returns {object} 200 - Favourite restaurants
 * @returns {Error} 500 - Server error
 * @security JWT
 */
router.get('/:custId/favourites', customerController.getRestaurantFavs);

module.exports = router;
