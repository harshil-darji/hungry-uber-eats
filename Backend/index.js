const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const { sequelize } = require('./models/data-model');

// Start the connection
try {
  // conn.sync({ alter: true })
  sequelize.sync().then(() => {
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
  });
} catch (err) {
  console.log(err);
}
