/* eslint-disable no-useless-return */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Restaurant = require('../../models/restaurant');

const handle_request = (msg, callback) => {
  const { body, restId, id } = msg;
  if (String(id) !== String(restId)) {
    callback(
      {
        isError: true,
        errorStatus: 401,
        error: 'Unauthorized request!',
      },
      null,
    );
    return;
  }

  Promise.resolve()
    .then(() => {
      if (body.restType) {
        const { restType } = body;
        delete body.restType;
        return Restaurant.updateOne(
          {
            _id: mongoose.Types.ObjectId(String(restId)),
          },
          { $set: { restType: [] } },
        )
          .then(() =>
            Restaurant.findOneAndUpdate(
              { _id: mongoose.Types.ObjectId(String(restId)) },
              { $addToSet: { restType } },
              { new: true },
            ),
          )
          .catch((err) => {
            callback(err, null);
          });
      }
      return null;
    })
    .then(() => {
      Restaurant.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(String(restId)) },
        { $set: body },
        { new: true },
      ).then((rest) => {
        callback(null, rest);
      });
    })
    .catch((err) => callback(err, null));
};

module.exports = handle_request;
