const Sequelize = require('sequelize');
const conf = require('../config/config.db');

const sequelize = new Sequelize(conf.DB, conf.USER, conf.PASSWORD, {
  host: conf.HOST,
  dialect: conf.dialect,
  operatorsAliases: false,
});

const customer = sequelize.define('customer', {
  custId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  emailId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  passwd: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  contactNo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING,
  },
  state: {
    type: Sequelize.STRING,
  },
  country: {
    type: Sequelize.STRING,
  },
  about: {
    type: Sequelize.STRING,
  },
  profileImg: {
    type: Sequelize.TEXT,
  },
  dob: {
    type: Sequelize.DATE,
  },
  nickName: {
    type: Sequelize.STRING,
  },
});

const customerAddress = sequelize.define('customerAddress', {
  address: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

customer.hasMany(customerAddress, {
  foreignKey: 'custId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

customerAddress.belongsTo(customer, {
  foreignKey: 'custId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

const restaurant = sequelize.define('restaurant', {
  restId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  emailId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  passwd: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  contactNo: {
    type: Sequelize.STRING,
  },
  city: {
    type: Sequelize.STRING,
  },
  state: {
    type: Sequelize.STRING,
  },
  address: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  profileImg: {
    type: Sequelize.STRING,
  },
  startTime: {
    type: Sequelize.TEXT,
  },
  endTime: {
    type: Sequelize.TEXT,
  },
  deliveryType: {
    type: Sequelize.ENUM,
    values: ['Pickup', 'Delivery'],
  },
});

const custFavs = sequelize.define('custFavs', {
  custFavId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

customer.hasMany(custFavs, {
  foreignKey: 'custId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

custFavs.belongsTo(customer, {
  foreignKey: 'custId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

restaurant.hasMany(custFavs, {
  foreignKey: 'restId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

custFavs.belongsTo(restaurant, {
  foreignKey: 'restId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

const restaurantType = sequelize.define('restaurantType', {
  restTypeId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  restType: {
    type: Sequelize.ENUM,
    values: ['Veg', 'Non-veg', 'Vegan'],
  },
});

restaurant.hasMany(restaurantType, {
  foreignKey: 'restId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

restaurantType.belongsTo(restaurant, {
  foreignKey: 'restId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

const dish = sequelize.define('dish', {
  dishId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ingreds: {
    type: Sequelize.STRING,
  },
  dishPrice: {
    type: Sequelize.FLOAT,
  },
  description: {
    type: Sequelize.STRING,
  },
  dishType: {
    type: Sequelize.STRING,
  },
  category: {
    type: Sequelize.ENUM,
    values: ['Veg', 'Non-veg', 'Vegan'],
  },
});

restaurant.hasMany(dish, {
  foreignKey: 'restId',
  onDelete: 'cascade',
  onUdpate: 'cascade',
});

dish.belongsTo(restaurant, {
  foreignKey: 'restId',
  onDelete: 'cascade',
  onUdpate: 'cascade',
});

const dishImages = sequelize.define('dishImages', {
  dishImageId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  imageLink: {
    type: Sequelize.STRING,
  },
});

dish.hasMany(dishImages, {
  foreignKey: 'dishId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

dishImages.belongsTo(dish, {
  foreignKey: 'dishId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

const order = sequelize.define('order', {
  orderId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderType: {
    type: Sequelize.ENUM,
    values: ['Delivery', 'Pickup'],
  },
  orderStatus: {
    type: Sequelize.ENUM,
    values: [
      'Initialized',
      'Placed',
      'Preparing',
      'Ready',
      'On the way',
      'Delivered',
      'Pickup up',
      'Cancelled',
    ],
  },
  price: {
    type: Sequelize.FLOAT,
  },
  taxPrice: {
    type: Sequelize.FLOAT,
  },
  totalPrice: {
    type: Sequelize.FLOAT,
  },
  orderPlacedTime: {
    type: Sequelize.DATE,
  },
  orderAddress: {
    type: Sequelize.STRING,
  },
});

customer.hasMany(order, {
  foreignKey: 'custId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

order.belongsTo(customer, {
  foreignKey: 'custId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

restaurant.hasMany(order, {
  foreignKey: 'restId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

order.belongsTo(restaurant, {
  foreignKey: 'restId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

const cart = sequelize.define('cart', {
  cartId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

customer.hasMany(cart, {
  foreignKey: 'custId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

cart.belongsTo(customer, {
  foreignKey: 'custId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

restaurant.hasMany(cart, {
  foreignKey: 'restId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

cart.belongsTo(restaurant, {
  foreignKey: 'restId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

dish.hasMany(cart, {
  foreignKey: 'dishId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

cart.belongsTo(dish, {
  foreignKey: 'dishId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

const orderDishes = sequelize.define('orderDishes', {
  orderDishesId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

order.hasMany(orderDishes, {
  foreignKey: 'orderId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

orderDishes.belongsTo(order, {
  foreignKey: 'orderId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

dish.hasMany(orderDishes, {
  foreignKey: 'dishId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

orderDishes.belongsTo(dish, {
  foreignKey: 'dishId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

module.exports = {
  sequelize,
  customer,
  customerAddress,
  restaurant,
  custFavs,
  restaurantType,
  dish,
  dishImages,
  order,
  cart,
};
