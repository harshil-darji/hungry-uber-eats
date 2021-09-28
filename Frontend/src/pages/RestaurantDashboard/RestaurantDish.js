/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-prototype-builtins */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router';
import jwt_decode from 'jwt-decode';
// import { Card, StyledBody } from 'baseui/card';
import { Container, Row, Col } from 'react-bootstrap';

import axiosInstance from '../../services/apiConfig';

function RestaurantDish() {
  const history = useHistory();
  const [dishes, setDishes] = useState([]);

  const fetchRestaurantDishes = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(
        `/restaurants/${decoded.id}/dishes`,
        {
          headers: { Authorization: token },
        },
      );
      setDishes(response.data.dishes);
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/restaurant');
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchRestaurantDishes();
  }, []);

  return (
    <Container fluid>
      <Row>
        {dishes.map((dish, index) => (
          <Col xs={4} key={index} style={{ marginTop: '30px' }}>
            <div className="card">
              <div className="row card-body">
                <div className="col-sm-6">
                  <h6 style={{ fontWeight: 'bold' }}>{dish.name}</h6>
                  <p style={{ color: 'grey', fontSize: '0.9em' }}>
                    {dish.description}
                  </p>
                  <div style={{ position: 'absolute', bottom: 0 }}>
                    $
                    {dish.dishPrice}
                  </div>
                </div>
                <img
                  className="col-sm-6"
                  src="https://play-lh.googleusercontent.com/coMv1dl31PCfEs6essJoEUwVryaqKHKQvENdZ_WYpN-PXa8Qfitkg3grQxIVN22W5A"
                  alt="sans"
                />
              </div>
            </div>
          </Col>
        ))}
        {/* <Col xs={4}>
          <div className="card">
            <div className="row card-body">
              <div className="col-sm-6">
                <h6 style={{ fontWeight: 'bold' }}>Large curly fry</h6>
                <p style={{ color: 'grey', fontSize: '0.9em' }}>
                  Seasoned, curly-cut fried potatoes
                </p>
                <div style={{ position: 'absolute', bottom: 0 }}>$5.56</div>
              </div>
              <img
                className="col-sm-6"
                src="https://play-lh.googleusercontent.com/coMv1dl31PCfEs6essJoEUwVryaqKHKQvENdZ_WYpN-PXa8Qfitkg3grQxIVN22W5A"
                alt="sans"
              />
            </div>
          </div>
        </Col> */}
      </Row>
    </Container>
  );
}

export default RestaurantDish;
