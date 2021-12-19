/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Customer = require('../models/customer');
const Restaurant = require('../models/restaurant');

const generateAccessToken = (id, role) => jwt.sign({ id, role }, process.env.TOKEN_SECRET, { expiresIn: '4h' });

const authenticateToken = (req, res, next) => {
  if (
    req.url === '/api/register/customers'
    || req.url === '/api/register/restaurants'
    || req.url === '/api/login/customers'
    || req.url === '/api/login/restaurants'
    || req.url === '/api/register/email'
    || req.url === '/api/login/email'
  ) {
    next();
    return;
  }

  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorised request!' });

  dotenv.config();

  jwt.verify(token, String(process.env.TOKEN_SECRET), async (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Forbidden request!' });

    const { id, role } = decoded;
    if (role === 'customer') {
      const user = await Customer.findOne({
        _id: id,
      });
      if (user) {
        req.headers.id = id;
        req.headers.role = role;
        next();
        return;
      }
      return res.status(403).json({ error: 'User does not exist!' });
    }
    if (role === 'restaurant') {
      const rest = await Restaurant.findOne({
        _id: id,
      });
      if (rest) {
        req.headers.id = id;
        req.headers.role = role;
        next();
        return;
      }
      return res.status(403).json({ error: 'Restaurant does not exist!' });
    }
    return res.status(403).json({ error: 'Forbidden request!' });
  });
  // return null;
};

module.exports = { generateAccessToken, authenticateToken };
