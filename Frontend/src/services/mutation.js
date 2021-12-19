const createCustomerMutation = `
mutation($customer: CustomerReq!) {
  createCustomer(customer: $customer){
    cust {
      _id
      emailId
      name
      contactNo
    }
    token
  }
}
`;

const updateCustomerMutation = `
mutation($customer: Customer!) {
  updateCustomer(customer: $customer){
    emailId
    name
    contactNo
    addresses
    favouriteRestaurants
    about
    city
    country
    nickName
    state
    profileImg
  }
}
`;

const createRestaurant = `
mutation($restaurant: RestaurantReq!) {
  createRestaurant(restaurant: $restaurant){
    rest {
      _id
      emailId
      name
      contactNo
    }
    token
  }
}
`;

const updateRestaurant = `
mutation($restaurant: Restaurant!) {
  updateRestaurant(restaurant: $restaurant){
    emailId
    name
    restType
    restImages
    dishes
    deliveryType
    description
    state
    contactNo
    address
    startTime
    endTime
  }
}
`;

const initCart = `
mutation($custId: String!) {
  initCart(custId: $custId){
    custId
    restId
    dishes
  }
}
`;

const resetCartWithDifferentRest = `
mutation($custId: String!, $restId: String!, dishes: [Dish]) {
  resetCartWithDifferentRest(custId: $custId,  restId: $restId, dishes: $dishes){
    custId
    restId
    dishes
  }
}
`;

const updateCart = `
mutation($custId: String!) {
  updateCart(custId: $custId){
    custId
    restId
    dishes
  }
}
`;

const createOrder = `
mutation($order: OrderReq!) {
  createOrder(order: $order){
    custId
    restId
    dishes
    orderStatus
    price
    taxPrice
    totalOrderPrice
    orderAddress
    orderPlacedTime
    orderType
  }
}
`;

const updateOrder = `
mutation($order: Order!) {
  updateOrder(order: $order){
    custId
    restId
    dishes
    orderStatus
    price
    taxPrice
    totalOrderPrice
    orderAddress
    orderPlacedTime
    orderType
  }
}
`;

export {
  createCustomerMutation,
  updateCustomerMutation,
  createRestaurant,
  updateRestaurant,
  initCart,
  resetCartWithDifferentRest,
  updateCart,
  createOrder,
  updateOrder,
};
