const { GraphQLError } = require('graphql');
const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant');

const restaurant = async (args) => {
  try {
    const { restId } = args;
    const rest = await Restaurant.findById(
      mongoose.Types.ObjectId(String(restId)),
    );
    if (rest) {
      return rest;
    }
    return new GraphQLError('Restaurant with specified ID does not exist!');
  } catch (error) {
    throw error;
  }
};

module.exports = { restaurant };
