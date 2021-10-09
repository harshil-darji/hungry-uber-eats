/* eslint-disable no-prototype-builtins */
import React, { useState, useEffect } from 'react';
import { Display4 } from 'baseui/typography';
import { Container, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';

import axiosInstance from '../../services/apiConfig';
import RestaurantCard from '../../components/RestaurantCard';

function CustomerFavourites() {
  const [restaurants, setRestaurants] = useState([]);
  const history = useHistory();

  const fetchRestaurants = async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(
        `customers/${decoded.id}/favourites`,
        {
          headers: { Authorization: token },
        },
      );
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

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <Container fluid>
      <div style={{ marginLeft: '75px', marginTop: '40px' }}>
        <Row>
          <Display4>Recently added</Display4>
        </Row>
        <Row>
          <Col>
            <Row>
              {restaurants?.length > 0
                ? restaurants.map((rest) => <RestaurantCard restData={rest} />)
                : null}
            </Row>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default CustomerFavourites;
