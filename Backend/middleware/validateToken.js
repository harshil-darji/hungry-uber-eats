/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const { customer, restaurant } = require('../models/data-model');

const generateAccessToken = (id, role) => jwt.sign({ id, role }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

const authenticateToken = (req, res, next) => {
  if (
    req.url === '/api/register/customers'
    || req.url === '/api/register/restaurants'
    || req.url === '/api/login/customers'
    || req.url === '/api/login/restaurants'
  ) {
    next();
    return;
  }

  const token = req.headers.authorization;
  if (token === null) return res.status(401).json({ error: 'Unauthorised request!' });

  dotenv.config();

  jwt.verify(token, String(process.env.TOKEN_SECRET), async (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Forbidden request!' });

    const { id, role } = decoded;
    if (role === 'customer') {
      const user = await customer.findOne({
        where: { custId: id },
      });
      if (user) {
        req.headers.id = id;
        req.headers.role = role;
        next();
        return;
      }
      return res.status(404).json({ error: 'User not found!' });
    }
    if (role === 'restaurant') {
      const rest = await restaurant.findOne({
        where: { restId: id },
      });
      if (rest) {
        req.headers.id = id;
        req.headers.role = role;
        next();
        return;
      }
      return res.status(404).json({ error: 'Restaurant not found!' });
    }
    return res.status(403).json({ error: 'Forbidden request!' });
  });
  // return null;
};

module.exports = { generateAccessToken, authenticateToken };
