const kafka = require('kafka-node');

const createKafkaTopics = () => {
  const client = new kafka.KafkaClient('localhost:2181');
  const admin = new kafka.Admin(client);
  admin.createTopics(
    [
      // Response topic
      {
        topic: 'response_topic',
        partitions: 1,
        replicationFactor: 1,
      },
      // Restaurant topics
      {
        topic: 'restaurant.login',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'restaurant.create',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'restaurant.update',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'restaurant.delete',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'restaurant.image.create',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'restaurant.image.delete',
        partitions: 1,
        replicationFactor: 1,
      },
      // Dish topics
      {
        topic: 'dish.create',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'dish.update',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'dish.delete',
        partitions: 1,
        replicationFactor: 1,
      },
      // Customer topics
      {
        topic: 'customer.login',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'customer.create',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'customer.update',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'customer.delete',
        partitions: 1,
        replicationFactor: 1,
      },
      // Customer addresses
      {
        topic: 'customer.address.create',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'customer.address.delete',
        partitions: 1,
        replicationFactor: 1,
      },
      // Customer favourites
      {
        topic: 'customer.favourites.create',
        partitions: 1,
        replicationFactor: 1,
      },
    ],
    (err) => {
      if (err) {
        console.error(err);
      }
    },
  );
};

module.exports = {
  createKafkaTopics,
};
