/* eslint-disable no-useless-return */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Restaurant = require('../../../models/restaurant');

const handle_request = (msg, callback) => {
  const { restId, restImageId } = msg;
  Restaurant.find(
    {
      'restImages._id': mongoose.Types.ObjectId(String(restImageId)),
    },
    {
      restImages: {
        $elemMatch: { _id: mongoose.Types.ObjectId(String(restImageId)) },
      },
    },
  )
    .then((existingImage) => {
      if (!existingImage.length) {
        callback(
          {
            isError: true,
            errorStatus: 404,
            error: 'Image not found!',
          },
          null,
        );
        return;
      }
    })
    .then(() => {
      Restaurant.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(String(restId)) },
        {
          $pull: {
            restImages: { _id: mongoose.Types.ObjectId(String(restImageId)) },
          },
        },
        { new: true },
      ).then(() => {
        callback(null, { message: 'Image deleted successfully!' });
      });
    })
    .catch((err) => callback(err, null));
};

module.exports = handle_request;
