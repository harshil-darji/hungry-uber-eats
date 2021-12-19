const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  scalar Date

  type Address {
    _id: String!
    address: String
    city: String
  }

  type Customer {
    _id: String!
    emailId: String!
    name: String
    contactNo: String
    addresses: [Address]
    favouriteRestaurants:[String]
    about: String
    city: String
    country: String
    nickName: String
    state: String
    profileImg: String
  }

  type Image {
    _id: String!
    imageLink: String
  }

  type Dish {
    _id: String!
    name: String
    dishPrice: Float
    ingreds: String
    description: String
    dishType: String
    category: String
    dishImages: [Image]
  }

  type Restaurant {
    _id: String!
    emailId: String!
    name: String
    restType: [String]
    restImages: [Image]
    dishes: [Dish]
    deliveryType: String
    description: String
    state: String
    contactNo: String
    address: String
    startTime: Date
    endTime: Date
  }

  type CartDish {
    _id: String!
    dishId: String!
    dishQuantity: Int
  }

  type Cart {
    _id: String
    custId: String
    restId: String
    dishes: [CartDish]
  }

  type OrderDishDetails {
    _id: String!
    name: String
    dishPrice: Float
    ingreds: String
    description: String
    dishType: String
    category: String
    dishImages: [Image]
    dishQuantity: Int
    totalDishPrice: Float
  }

  type OrderDish {
    _id: String!
    dishDetails: [OrderDishDetails]
  }

  type Order {
    _id: String!
    custId: String
    restId: String
    dishes: [OrderDish]
    orderStatus: String
    price: Float
    taxPrice: Float
    totalOrderPrice: Float
    orderAddress: String
    orderPlacedTime: Date
    orderType: String
  }

  input CustomerReq {
    emailId: String!
    name: String!
    contactNo: String!
    passwd: String!
  }

  input RestaurantReq {
    emailId: String!
    name: String!
    passwd: String!
  }

  input DishReq {
    name: String
    dishPrice: Float
    ingreds: String
    description: String
    dishType: String
    category: String
  }


  input OrderDishDetailsReq {
    name: String
    dishPrice: Float
    ingreds: String
    description: String
    dishType: String
    category: String
    dishQuantity: Int
    totalDishPrice: Float
  }

  input OrderDishReq {
    dishDetails: [OrderDishDetailsReq]
  }

  input OrderReq {
    custId: String
    restId: String
    dishes: [OrderDishReq]
    price: Float
    taxPrice: Float
    totalOrderPrice: Float
    orderAddress: String
    orderPlacedTime: Date
    orderType: String
  }

  type CustomerOutput {
    token: String
    cust: Customer
  }

  type RestaurantOutput {
    token: String
    rest: Restaurant
  }

  type RootQuery {
    customer(custId: String!): Customer
    restaurant(restId: String!): Restaurant
    cart(custId: String!): Cart
    order(orderId: String!, custId: String!): Order

    restaurants: [Restaurant]
    customerOrders(custId: String!): [Order]
    restaurantOrders(restId: String!): [Order]
  }

  type RootMutation {
    createCustomer(customer: CustomerReq!): CustomerOutput
    updateCustomer(customer: CustomerReq!): Customer

    createRestaurant(restaurant: RestaurantReq!): RestaurantOutput
    updateRestaurant(restaurant: RestaurantReq!): Restaurant

    initCart(custId: String!): Cart
    resetCartWithDifferentRest(custId: String!, restId: String!, dishes: [DishReq]): Cart
    updateCart(custId: String!): Cart

    createOrder(order: OrderReq!): Order
    updateOrder(order: OrderReq!): Order
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
