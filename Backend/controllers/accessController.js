/* eslint-disable no-useless-escape */
module.exports = {
  'POST /register/customers': ['customer'],
  'POST /register/restaurants': ['restaurant'],
  'POST /login/customers': ['customer'],
  'POST /login/restaurants': ['restaurant'],
  'GET /customers/(.+)': ['customer'],
  'PUT /customers/(.+)': ['customer'],
  'GET /restaurants/(.)*/dishes/(.)*': ['customer', 'restaurant'],
  'POST /restaurants/(.)*/dishes': ['restaurant'],
  'PUT /restaurants/(.)*': ['restaurant'],
  'PUT /restaurants/(.)*/dishes': ['restaurant'],
  'DELETE /restaurants/(.)+/dishes/(.)+': ['restaurant'],
  'DELETE /restaurants/(.)+': ['admin'],
  'DELETE /customers/(.)+': ['admin'],
};
