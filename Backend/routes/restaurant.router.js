const { Router } = require('express');
const { restaurantController, orderController } = require('../controllers');
const {
  dishValidationRules,
  validate,
} = require('../controllers/valdiationRules');

const router = Router();

/**
 * @typedef Restaurant
 * @property {string} emailId.required
 * @property {string} passwd.required
 * @property {string} name.required
 * @property {string} contactNo
 * @property {string} city
 * @property {string} state
 * @property {string} address
 * @property {string} description
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} deliveryType
 */

/**
 * @typedef Dish
 * @property {string} name.required
 * @property {integer} dishPrice.required
 * @property {string} ingreds
 * @property {string} description
 * @property {string} dishType
 * @property {string} category
 */

/**
 * @typedef AddImage
 * @property {string} imageLink.required
 */

// Restaurant routes

/**
 * @route GET /restaurants
 * @summary Get all restaurants
 * @group Restaurant - Restaurant operations
 * @param {string} city.query
 * @param {string} restType.query
 * @param {string} deliveryType.query
 * @returns {object} 200 - List of restaurants
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.get('/', restaurantController.getRestaurants);

/**
 * @route GET /restaurants/search
 * @summary Search restaurants
 * @group Restaurant - Restaurant operations
 * @param {string} searchQuery.query
 * @returns {string} 200 - List of restaurants
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.get('/search', restaurantController.searchRestaurants);

/**
 * @route GET /restaurants/{restId}
 * @summary Get Restaurant by ID
 * @group Restaurant - Restaurant operations
 * @param {string} restId.path.required
 * @returns {object} 200 - Restaurant details
 * @returns {Error} 404 - Restaurant not found
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.get('/:restId', restaurantController.getRestaurant);

/**
 * @route PUT /restaurants/{restId}
 * @summary Update restaurant
 * @group Restaurant - Restaurant operations
 * @param {Restaurant.model} Restaurant.body.required
 * @param {string} restId.path.required
 * @returns {object} 200 - Restaurant registered
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.put('/:restId', restaurantController.updateRestaurant);

/**
 * @route DELETE /restaurants/{restId}
 * @summary Delete Restaurant by ID
 * @group Restaurant - Restaurant operations
 * @param {string} restId.path.required
 * @returns {object} 200 - Restaurant deleted
 * @returns {Error} 404 - Restaurant not found
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.delete('/:restId', restaurantController.deleteRestaurant);

// Restaurant Dishes routes

/**
 * @route POST /restaurants/{restId}/dishes
 * @summary Add dish to restaurant
 * @group Restaurant - Restaurant operations
 * @param {Dish.model} Dish.body
 * @param {string} restId.path.required
 * @returns {object} 201 - Dish added
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.post(
  '/:restId/dishes',
  dishValidationRules(),
  validate,
  restaurantController.createDish,
);

/**
 * @route GET /restaurants/{restId}/dishes
 * @summary Get restaurant dishes
 * @group Restaurant - Restaurant operations
 * @param {string} restId.path.required
 * @returns {object} 200 - List of dishes
 * @returns {object} 404 - Restaurant not found
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.get('/:restId/dishes', restaurantController.getRestaurantDishes);

/**
 * @route GET /restaurants/{restId}/dishes/{dishId}
 * @summary Get restaurant dish details
 * @group Restaurant - Restaurant operations
 * @param {string} restId.path.required
 * @param {string} dishId.path.required
 * @returns {object} 200 - List of dishes
 * @returns {object} 404 - Restaurant not found
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.get('/:restId/dishes/:dishId', restaurantController.getRestaurantDish);

/**
 * @route PUT /restaurants/{restId}/dishes/{dishId}
 * @summary Update restaurant dish
 * @group Restaurant - Restaurant operations
 * @param {Dish.model} Dish.body
 * @param {string} restId.path.required
 * @param {string} dishId.path.required
 * @returns {object} 200 - Dish updated
 * @returns {object} 404 - Dish not found
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.put(
  '/:restId/dishes/:dishId',
  restaurantController.updateRestaurantDish,
);

/**
 * @route DELETE /restaurants/{restId}/dishes/{dishId}
 * @summary Delete restaurant dish
 * @group Restaurant - Restaurant operations
 * @param {string} restId.path.required
 * @param {string} dishId.path.required
 * @returns {object} 200 - Dish deleted
 * @returns {object} 404 - Dish not found
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.delete(
  '/:restId/dishes/:dishId',
  restaurantController.deleteRestaurantDish,
);

// Restaurant images
/**
 * @route POST /restaurants/{restId}/images
 * @summary Add restaurant image
 * @group Restaurant - Restaurant operations
 * @param {AddImage.model} AddImage.body
 * @param {string} restId.path.required
 * @returns {object} 201 - Restaurant image added
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.post('/:restId/images', restaurantController.addRestaurantImage);

/**
 * @route GET /restaurants/{restId}/images
 * @summary Get restaurant images
 * @group Restaurant - Restaurant operations
 * @param {string} restId.path.required
 * @returns {object} 200 - List of restaurant images
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.get('/:restId/images', restaurantController.getRestaurantImages);

/**
 * @route DELETE /restaurants/{restId}/images/{restImageId}
 * @summary Delete restaurant image
 * @group Restaurant - Restaurant operations
 * @param {string} restId.path.required
 * @param {string} restImageId.path.required
 * @returns {object} 200 - Restaurant image deleted
 * @returns {object} 404 - Restaurant image not found
 * @returns {Error}  500 - Server error
 * @security JWT
 */
router.delete(
  '/:restId/images/:restImageId',
  restaurantController.deleteRestaurantImage,
);

// Dish images
/**
 * @route POST /restaurants/{restId}/dishes/{dishId}/images
 * @summary Add dish image
 * @group Restaurant - Restaurant operations
 * @param {AddImage.model} AddImage.body
 * @param {string} restId.path
 * @param {string} dishId.path.required
 * @returns {object} 201 - Dish image added
 * @returns {Error}  500 - Server error
 * @security JWT
 */
// router.post(
//   '/:restId/dishes/:dishId/images',
//   restaurantController.createDishImage,
// );

// router.delete(
//   '/:restId/dishes/:dishId/images',
//   restaurantController.deleteDishImage,
// );

// TODO: DO THIS BRO
router.get('/:restId/orders', orderController.getRestaurantOrders);
router.get('/:restId/orders/:orderId', orderController.getRestaurantOrderDetailsById);
router.get('/:restId/orders/search/:orderStatus', orderController.getRestOrderDetailsByOrderStatus);
router.put('/:restId/orders/:orderId', orderController.updateOrder);

module.exports = router;
