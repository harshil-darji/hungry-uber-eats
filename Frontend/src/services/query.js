const getCustomerQuery = `
  query($custId: String!) {
    customer(custId: $custId){
      emailId
      name
      contactNo
      addresses {
        address
        city
      }
      about
      city
      country
      nickName
      state
      profileImg
    }
  }
`;

const getRestaurantQuery = `
  query($restId: String!) {
    restaurant(restId: $restId){
      _id
      emailId
      name
      restType
      restImages {
        _id
        imageLink
      }
      dishes {
        _id
        name
        ingreds
        description
        dishType
        category
        dishPrice
        dishImages {
        _id
          imageLink
        }
      }
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

const getRestaurants = `
  query() {
    restaurants(){
      _id
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

const getCartItems = `
  query($custId: String!) {
    cart(custId: $custId){
      custId
      restId
      dishes
    }
  }
`;

const customerOrders = `
  query($custId: String!) {
    customerOrders(custId: $custId){
      _id
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

const restaurantOrders = `
  query($restId: String!) {
    restaurantOrders(restId: $restId){
      _id
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

const orderByID = `
  query($custId: String!, orderId: String!) {
    restaurantOrders(cust: $custId, orderId: $orderId){
      _id
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
  getCustomerQuery,
  getRestaurantQuery,
  getRestaurants,
  getCartItems,
  customerOrders,
  restaurantOrders,
  orderByID,
};
