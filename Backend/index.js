const express = require('express');
const cors = require('cors');
// const { getAccessMiddleware } = require('u-server-utils');

const dotenv = require('dotenv');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./grahql.schema');

const { customer, createCustomer } = require('./resolvers/customer');
const { restaurant } = require('./resolvers/restaurant');
const { cart } = require('./resolvers/cart');
const { order } = require('./resolvers/order');

dotenv.config({ path: path.join(__dirname, '.env') });

const app1 = express();
const app2 = express();

const expressSwagger = require('express-swagger-generator')(app1);

const mongoose = require('mongoose');

const { createKafkaTopics } = require('./kafka/topics');

const options = {
  swaggerDefinition: {
    info: {
      description: 'Ubereats',
      title: 'Swagger',
      version: '2.0',
    },
    host: 'localhost:8080',
    basePath: '/api',
    produces: ['application/json'],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'Authorization token',
      },
    },
  },
  basedir: __dirname,
  files: ['./routes/**/*.js'],
};
expressSwagger(options);

app1.use(cors());
app2.use(cors());

app1.use(express.json());

app1.use(express.urlencoded({ extended: true }));

const routes = require('./routes');

const { authenticateToken } = require('./middleware/validateToken');

app1.use(authenticateToken);

// app2.use(authenticateToken);

const root = {
  customer,
  createCustomer,
  restaurant,
  cart,
  order,
};

app2.use(
  '/api',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: root,
    graphiql: true,
  }),
);

app1.use('/api', routes);

// const accessController = require('./controllers/accessController');

// app.use(getAccessMiddleware(accessController));

// Start the connection

const main = async () => {
  try {
    await createKafkaTopics();
    // Connect to the MongoDB cluster
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 100,
      useNewUrlParser: 'true',
      autoIndex: true,
    });
    console.log('Mongo cluster connected');

    const PORT = 8080;
    const GPORT = 8081;

    app1
      .listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
      })
      .on('error', (err) => {
        if (err.errno === 'EADDRINUSE') {
          console.log('Port is busy, trying with different port');
        } else {
          console.log(err);
        }
      });

    app2
      .listen(GPORT, () => {
        console.log(`GServer running on ${GPORT}`);
      })
      .on('error', (err) => {
        if (err.errno === 'EADDRINUSE') {
          console.log('Port is busy, trying with different port');
        } else {
          console.log(err);
        }
      });
  } catch (e) {
    console.error(e);
  }
};

main().catch(console.error);

module.exports = app1;
