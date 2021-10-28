/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-prototype-builtins */
import React, { useState, useEffect } from 'react';
import { Display4 } from 'baseui/typography';
import { Container, Row } from 'react-bootstrap';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';

import axiosInstance from '../../services/apiConfig';
import RestaurantCard from '../../components/RestaurantCard';

function CustomerFavourites() {
  const [restaurants, setRestaurants] = useState([]);

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
      console.log(error);
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
        <Row style={{ width: '90vw' }}>
          {restaurants?.length > 0
            ? restaurants.map((rest) => (
                <RestaurantCard restData={rest} />
              ))
            : null}
        </Row>
      </div>
    </Container>
  );
}

export default CustomerFavourites;
