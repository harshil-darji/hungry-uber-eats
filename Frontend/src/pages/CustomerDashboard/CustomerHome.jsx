/* eslint-disable no-prototype-builtins */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from 'react';
// eslint-disable-next-line object-curly-newline
import { useHistory } from 'react-router';
import { Container, Row, Col } from 'react-bootstrap';
import { H3, H4 } from 'baseui/typography';
import ArrowRight from 'baseui/icon/arrow-right';
import { Button, SHAPE } from 'baseui/button';
import { ThemeProvider, createTheme, lightThemePrimitives } from 'baseui';
import toast from 'react-hot-toast';

import axiosInstance from '../../services/apiConfig';

import cardImage from '../../assets/img/cardImage.png';
import '../../css/CustomerHome.css';
import RestaurantCard from '../../components/RestaurantCard';

function CustomerHome() {
  const [restaurants, setRestaurants] = useState([]);
  const history = useHistory();

  const fetchRestaurants = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await axiosInstance.get('restaurants/', {
        headers: { Authorization: token },
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
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <Container fluid>
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
        <Col sm={4}>
          <H3>All stores</H3>
        </Col>
        <Col>
          <Row>
            {restaurants?.length > 0
              ? restaurants.map((rest) => <RestaurantCard restData={rest} />)
              : null}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default CustomerHome;
