/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Restaurant = require('../../models/restaurant');

const handle_request = (msg, callback) => {
  const { restId } = msg;
  Restaurant.findByIdAndDelete(mongoose.Types.ObjectId(String(restId)))
    .then((deleted) => {
      if (!deleted) {
        callback(
          {
            isError: true,
            errorStatus: 404,
            error: 'Restaurant does not exist!',
          },
          null,
        );
        return;
      }
      callback(null, { message: 'Restaurant deleted successfully!' });
    })
    .catch((err) => {
      callback(err, null);
    });
};

module.exports = handle_request;
