const express = require('express');
const cors = require('cors');
// const { getAccessMiddleware } = require('u-server-utils');

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const expressSwagger = require('express-swagger-generator')(app);

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

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const routes = require('./routes');

const { authenticateToken } = require('./middleware/validateToken');

app.use(authenticateToken);

app.use('/api', routes);

// const accessController = require('./controllers/accessController');

// app.use(getAccessMiddleware(accessController));

// Start the connection

const main = async () => {
  try {
    await createKafkaTopics();
    // Connect to the MongoDB cluster
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: 'true',
      autoIndex: true,
    });
    console.log('Mongo cluster connected');

    const PORT = 8080;
    app
      .listen(PORT, () => {
        console.log('Server running on 8080');
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
