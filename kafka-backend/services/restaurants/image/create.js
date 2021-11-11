/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Restaurant = require('../../../models/restaurant');

const handle_request = (msg, callback) => {
  const { restId, body } = msg;
  if (!body.imageLink) {
    callback(
      {
        isError: true,
        errorStatus: 400,
        error: 'Image link not found!',
      },
      null,
    );
    return;
  }
  Restaurant.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(String(restId)) },
    { $push: { restImages: body } },
    { new: true },
  )
    .then((restImage) => {
      callback(null, { restImage });
    })
    .catch((err) => callback(err, null));
};

module.exports = handle_request;
