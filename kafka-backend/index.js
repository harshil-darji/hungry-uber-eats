/* eslint-disable camelcase */
/* eslint-disable no-new-require */
// eslint-disable-next-line new-cap
const connection = new require('./kafka/connection');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

// Restaurant topics
const createRestaurant = require('./services/restaurants/create');
const loginRestaurant = require('./services/restaurants/login');
const updateRestaurant = require('./services/restaurants/update');
const deleteRestaurant = require('./services/restaurants/delete');
const createRestaurantImage = require('./services/restaurants/image/create');
const deleteRestaurantImage = require('./services/restaurants/image/delete');
// Dish topics
const createDish = require('./services/dish/create');
const deleteDish = require('./services/dish/delete');
const updateDish = require('./services/dish/update');
// Customer topics
const createCustomer = require('./services/customers/create');
const loginCustomer = require('./services/customers/login');
const updateCustomer = require('./services/customers/update');
// Customer address topics
const createCustomerAddress = require('./services/customers/addresses/create');
const deleteCustomerAddress = require('./services/customers/addresses/delete');
// Customer favourite topics
const createCustomerFavourite = require('./services/customers/favourites/create');
// Cart topics
const createCart = require('./services/cart/create');
const resetCart = require('./services/cart/reset');
const getCart = require('./services/cart/get');
const deleteFromCart = require('./services/cart/delete');
const clearCart = require('./services/cart/clear');
// Order topics
const orderInit = require('./services/order/init');
const orderCreate = require('./services/order/create');
const orderCancel = require('./services/order/cancel');
const orderUpdate = require('./services/order/update');

function handleTopicRequest(topic_name, fname) {
  const consumer = connection.getConsumer(topic_name);
  const producer = connection.getProducer();
  consumer.on('message', (message) => {
    try {
      const data = JSON.parse(message.value);
      fname(data.data, (err, res) => {
        let payloads = [];
        if (err) {
          payloads = [
            {
              topic: 'response_topic',
              messages: JSON.stringify({
                correlationId: data.correlationId,
                data: err,
              }),
              partition: 0,
            },
          ];
        } else {
          payloads = [
            {
              topic: 'response_topic',
              messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res,
              }),
              partition: 0,
            },
          ];
        }
        producer.send(payloads, (error) => {
          if (error) {
            console.log('Error from backend: ', JSON.stringify(error));
            // return;
          }
          // console.log('Sent data from backend1: ', JSON.stringify(res));
        });
      });
    } catch (e) {
      const payloads = [
        {
          topic: 'response_topic',
          messages: JSON.stringify({
            data: e,
          }),
          partition: 0,
        },
      ];
      producer.send(payloads, (error, producerData) => {
        if (error) {
          console.log('Error with kafka: ', JSON.stringify(error));
          return;
        }
        console.log('Kafka backend reponse: ', JSON.stringify(producerData));
      });
    }
  });
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: 'true',
  autoIndex: true,
});

// Add your TOPICs here
// First argument is topic name
// Second argument is a function that will handle this topic request

// Restaurant topic handlers
handleTopicRequest('restaurant.create', createRestaurant);
handleTopicRequest('restaurant.login', loginRestaurant);
handleTopicRequest('restaurant.update', updateRestaurant);
handleTopicRequest('restaurant.delete', deleteRestaurant);
handleTopicRequest('restaurant.image.create', createRestaurantImage);
handleTopicRequest('restaurant.image.delete', deleteRestaurantImage);

// Dish topic handlers
handleTopicRequest('dish.create', createDish);
handleTopicRequest('dish.delete', deleteDish);
handleTopicRequest('dish.update', updateDish);

// Customer topic handlers
handleTopicRequest('customer.create', createCustomer);
handleTopicRequest('customer.login', loginCustomer);
handleTopicRequest('customer.update', updateCustomer);

// Customer addresses topic handlers
handleTopicRequest('customer.address.create', createCustomerAddress);
handleTopicRequest('customer.address.delete', deleteCustomerAddress);

// Customer favourites topic handler
handleTopicRequest('customer.favourites.create', createCustomerFavourite);

// Cart topic handler
handleTopicRequest('cart.create', createCart);
handleTopicRequest('cart.reset', resetCart);
handleTopicRequest('cart.get', getCart);
handleTopicRequest('cart.delete', deleteFromCart);
handleTopicRequest('cart.clear', clearCart);

// Order topic handlers
handleTopicRequest('order.init', orderInit);
handleTopicRequest('order.create', orderCreate);
handleTopicRequest('order.cancel', orderCancel);
handleTopicRequest('order.update', orderUpdate);
