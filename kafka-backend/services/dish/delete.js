/* eslint-disable no-useless-return */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Restaurant = require('../../models/restaurant');

const handle_request = (msg, callback) => {
  const { restId, dishId } = msg;
  Restaurant.find(
    {
      'dishes._id': mongoose.Types.ObjectId(String(dishId)),
    },
    {
      dishes: {
        $elemMatch: { _id: mongoose.Types.ObjectId(String(dishId)) },
      },
    },
  )
    .then((existingDish) => {
      if (!existingDish.length) {
        callback(
          {
            isError: true,
            errorStatus: 404,
            error: 'Dish not found!',
          },
          null,
        );
        return;
      }
    })
    .then(() => {
      Restaurant.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(String(restId)) },
        { $pull: { dishes: { _id: mongoose.Types.ObjectId(String(dishId)) } } },
        { new: true },
      ).then(() => {
        callback(null, { message: 'Dish deleted!' });
      });
    })
    .catch((err) => callback(err, null));
};

module.exports = handle_request;
