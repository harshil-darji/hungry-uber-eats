/* eslint-disable no-prototype-builtins */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line object-curly-newline
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Container, Row, Col } from 'react-bootstrap';
import { H3, H4, H6 } from 'baseui/typography';
import ArrowRight from 'baseui/icon/arrow-right';
import { Button, SHAPE } from 'baseui/button';
import { ThemeProvider, createTheme, lightThemePrimitives } from 'baseui';
import toast from 'react-hot-toast';
import { Radio, RadioGroup } from 'baseui/radio';
import { Accordion, Panel } from 'baseui/accordion';
import _ from 'underscore';

import axiosInstance from '../../services/apiConfig';

import cardImage from '../../assets/img/cardImage.png';
import '../../css/CustomerHome.css';
import RestaurantCard from '../../components/RestaurantCard';
import IceCreamSvg from '../../components/IceCreamSvg';
import IconsList from '../../components/IconsList';
import { setReduxRestType } from '../../actions/searchFilter';

function CustomerHome() {
  const [restaurants, setRestaurants] = useState([]);
  const [restType, setRestType] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  console.log(restaurants);

  const searchFilter = useSelector((state) => state.searchFilter);

  const fetchRestaurants = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await axiosInstance.get('restaurants/', {
        params: {
          city: searchFilter.city,
          deliveryType: searchFilter.deliveryType,
          restType: searchFilter.restType,
        },
        headers: {
          Authorization: token,
        },
      });
      setRestaurants(response.data.restaurants);
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/');
        }
      }
    }
  };

  const searchRestaurants = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await axiosInstance.get('restaurants/search', {
        params: {
          searchQuery: searchFilter.searchQuery,
        },
        headers: {
          Authorization: token,
        },
      });
      const uniqueRestObjects = await _.uniq(
        response.data.restaurants,
        (x) => x.restId,
      );
      uniqueRestObjects.forEach((rest) => {
        // eslint-disable-next-line no-param-reassign
        rest.restaurantImages = [{ imageLink: rest.imageLink }];
      });
      setRestaurants(uniqueRestObjects);
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/');
        }
      }
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [searchFilter.city, searchFilter.deliveryType, searchFilter.restType]);

  useEffect(() => {
    searchRestaurants();
  }, [searchFilter.searchQuery]);

  useEffect(() => {
    if (restType.length > 0) {
      dispatch(setReduxRestType(restType));
    }
  }, [restType]);

  return (
    <Container fluid>
      <Row>
        <IconsList />
      </Row>
      <hr />
      <Row>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '24px 50px',
            height: '300px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '110px',
            }}
          >
            <p style={{ fontSize: '44px', fontWeight: 'bold' }}>
              Crave it? Get it.
            </p>
            <p style={{ fontSize: '16px' }}>
              Search for a favourite restaurant or dish
            </p>
          </div>
        </div>
        <Col>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="cardWidth">
              <div className="card bgColorYellow">
                <div className="row">
                  <div className="col-sm-8">
                    <div style={{ padding: '20px' }}>
                      <H4 className="card-title" marginBottom="scale500">
                        Unlimited $0 delivery fee + 5% off with Eats Pass
                      </H4>
                      <div style={{ position: 'absolute', bottom: '20px' }}>
                        <ThemeProvider
                          theme={createTheme(lightThemePrimitives, {
                            colors: {
                              buttonPrimaryFill: '#FFFFF',
                              buttonPrimaryText: '#00000',
                              buttonPrimaryHover: '#FFFFFF',
                            },
                          })}
                        >
                          <Button
                            endEnhancer={<ArrowRight />}
                            shape={SHAPE.pill}
                            // onClick={() => history.push('/register/restaurant')}
                          >
                            Try 1 month free
                          </Button>
                        </ThemeProvider>
                      </div>
                    </div>
                  </div>
                  <img className="col-sm-4" src={cardImage} alt="sans" />
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm={4} style={{ marginLeft: '30px' }}>
          <H3>All stores</H3>
          <Accordion>
            <Panel style={{ backgroundColor: 'grey' }} title="Restaurant type">
              <RadioGroup
                name="restType"
                onChange={(e) => setRestType(e.target.value)}
                value={restType}
              >
                <Radio value="">Any</Radio>
                <Radio value="Veg">Veg</Radio>
                <Radio value="Non-veg">Non-Veg</Radio>
                <Radio value="Vegan">Vegan</Radio>
              </RadioGroup>
            </Panel>
          </Accordion>
        </Col>
        <Col>
          <Row>
            {restaurants?.length > 0 ? (
              restaurants.map((rest) => <RestaurantCard restData={rest} />)
            ) : (
              <>
                <Row
                  style={{
                    diplay: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    marginTop: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: '20px',
                    }}
                  >
                    <IceCreamSvg />
                    <H6 style={{ marginTop: '10px' }}>Nothing to eat here!</H6>
                    <p style={{ marginTop: '10px' }}>
                      Try different filters for searching!
                    </p>
                  </div>
                </Row>
              </>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default CustomerHome;
