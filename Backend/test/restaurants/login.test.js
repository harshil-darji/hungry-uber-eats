/* eslint-disable camelcase */
/* eslint-disable global-require */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
// const { Types } = require('mongoose');
const sinon = require('sinon');
// const mongoose = require('mongoose');

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

chai.should();
chai.use(chaiHttp);

const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../../middleware/validateToken');

const Restaurant = require('../../models/restaurant');
const kafkaClient = require('../../kafka/client');

describe('Restaurant Testcases', () => {
  before(() => {
    process.env.MONGO_URI = process.env.MONGO_TEST_URI;
    app = require('../../index');
    // Restaurant.deleteMany({}).then(() => {
    //   done();
    // });
  });

  beforeEach(() => {
    stb = sinon
      .stub(kafkaClient, 'make_request')
      .callsFake((queue_name, msg, callback) => {
        if (queue_name === 'restaurant.create') {
          console.log('bruheheheh');
          // Check if email already exists
          Restaurant.find({
            emailId: msg.emailId,
          })
            .then((checkRestaurant) => {
              if (checkRestaurant.length) {
                callback(
                  {
                    isError: true,
                    error:
                      "There's already an account with this email. Please sign in.",
                  },
                  null,
                );
              }
            })
            .catch((err) => callback(err, null));
          // Else create new restaurant
          bcrypt
            .hash(msg.passwd, 12)
            .then((hash) => {
              msg.passwd = hash;
              const newRestaurant = new Restaurant(msg);
              return newRestaurant.save();
            })
            .then((rest) => {
              console.log('rest', rest);
              const token = generateAccessToken(rest._id, 'restaurant');
              return { rest, token };
            })
            .then((resp) => {
              callback(null, { ...resp });
            })
            .catch((err) => {
              console.log(err);
              callback(err, null);
            });
        }
      });
    app = require('../../index');
  });

  afterEach(() => {
    stb.restore();
  });

  it('it should create a restaurant', (done) => {
    const data = {
      emailId: 'test1@gmail.com',
      passwd: 'test1',
      name: 'Test Restaurant',
    };

    chai
      .request(app)
      .post('/register/restaurants')
      .send(data)
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          res.should.have.status(201);
          res.body.should.have.property('token').to.be.a('string');
          res.body.should.have.property('name').eql('Test Restaurant');
          res.body.should.have.property('description').eql('Test Description');
          res.body.should.have.property('address').eql('Test Address');
          res.body.should.have.property('city').eql('San Jose');
          res.body.should.have.property('state').eql('California');
          res.body.should.have.property('country').eql('USA');
          res.body.should.have.property('contact_no').eql('89898989856');
          res.body.should.have.property('time_open').eql('10:00');
          res.body.should.have.property('time_close').eql('20:00');
          res.body.should.have.property('food_type').eql('veg');
          res.body.should.have.property('restaurant_type').eql('delivery');
        }
        done();
      });
  });

  // it('it should fetch the created restaurant', (done) => {
  //   chai
  //     .request(app)
  //     .get('/restaurants/616eee906f354a1864dc650d')
  //     .set('Authorization', 'secrettoken')
  //     .end((err, res) => {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         res.should.have.status(200);
  //         res.body.should.have.property('name').eql('Test Restaurant');
  //         res.body.should.have.property('description').eql('Test Description');
  //         res.body.should.have.property('address').eql('Test Address');
  //         res.body.should.have.property('city').eql('San Jose');
  //         res.body.should.have.property('state').eql('California');
  //         res.body.should.have.property('country').eql('USA');
  //         res.body.should.have.property('contact_no').eql('89898989856');
  //         res.body.should.have.property('time_open').eql('10:00');
  //         res.body.should.have.property('time_close').eql('20:00');
  //         res.body.should.have.property('food_type').eql('veg');
  //         res.body.should.have.property('restaurant_type').eql('delivery');
  //       }
  //       done();
  //     });
  // });

  // it('it should update the restaurant', (done) => {
  //   const data = {
  //     name: 'Test Updated Restaurant',
  //     description: 'Test Updated Description',
  //     address: 'Test Updated Address',
  //     city: 'Fremont',
  //     state: 'California',
  //     country: 'USA',
  //     contact_no: '9898989898',
  //     time_open: '08:00',
  //     time_close: '22:00',
  //     food_type: 'non-veg',
  //     restaurant_type: 'pickup',
  //   };

  //   chai
  //     .request(app)
  //     .put('/restaurants/616eee906f354a1864dc650d')
  //     .send(data)
  //     .set('Authorization', 'secrettoken')
  //     .end((err, res) => {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         res.should.have.status(200);
  //         res.body.should.have.property('name').eql('Test Updated Restaurant');
  //         res.body.should.have
  //           .property('description')
  //           .eql('Test Updated Description');
  //         res.body.should.have.property('address').eql('Test Updated Address');
  //         res.body.should.have.property('city').eql('Fremont');
  //         res.body.should.have.property('state').eql('California');
  //         res.body.should.have.property('country').eql('USA');
  //         res.body.should.have.property('contact_no').eql('9898989898');
  //         res.body.should.have.property('time_open').eql('08:00');
  //         res.body.should.have.property('time_close').eql('22:00');
  //         res.body.should.have.property('food_type').eql('non-veg');
  //         res.body.should.have.property('restaurant_type').eql('pickup');
  //       }
  //       done();
  //     });
  // });
});
