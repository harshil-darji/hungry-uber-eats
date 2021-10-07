/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable no-prototype-builtins */
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router';

import Carousel from 'react-responsive-carousel/lib/js/components/Carousel/index';
import { Display3 } from 'baseui/typography';
import { Col, Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';

import ticketSmall from '../../assets/img/ticket-small.png';
import axiosInstance from '../../services/apiConfig';
import RestaurantDetailsCard from './RestaurantDetailsCard';
import '../../css/RestaurantDetails.css';

// const { Carousel } = require('react-responsive-carousel');

function RestaurantDetails({ match }) {
  const [restDetails, setRestDetails] = useState(null);
  const [cartInfo, setCartInfo] = useState({});
  const cart = useSelector((state) => state.cart);

  const history = useHistory();

  const getCartItems = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(`customers/${decoded.id}/cart`, {
        headers: { Authorization: token },
      });
      setCartInfo(response.data);
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/customer');
        }
      }
    }
  }, []);

  const fetchRestaurants = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await axiosInstance.get(
        `restaurants/${match.params.restId}`,
        {
          headers: { Authorization: token },
        },
      );
      setRestDetails(response.data.rest);
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
    getCartItems();
  }, [cart]);

  return (
    <Container fluid>
      <Row>
        <div
          style={{
            position: 'absolute',
            left: '80px',
            top: '280px',
            zIndex: 100,
          }}
        >
          <Display3 color="white">
            {restDetails?.name}{' '}
            {restDetails?.address ? `(${restDetails.address})` : null}
          </Display3>
          <div style={{ display: 'flex' }}>
            <img src={ticketSmall} width="20px" height="20px" alt="ticket" />
            <p style={{ color: 'white' }}>&bull; $0.49 Delivery fee &bull; </p>
            <p style={{ color: 'white' }}> 25-35 min</p>
          </div>
        </div>
        {restDetails?.restaurantImages ? (
          <Carousel
            autoPlay
            infiniteLoop
            interval={3000}
            transitionTime={1500}
            showIndicators={false}
            showThumbs={false}
            showArrows={false}
          >
            {restDetails.restaurantImages?.length > 0
              ? restDetails.restaurantImages.map((ele) => (
                  <div key={ele.restImageId}>
                    <img src={ele.imageLink} alt="Restaurant" />
                  </div>
                ))
              : null}
          </Carousel>
        ) : null}
      </Row>

      <div style={{ padding: '20px' }}>
        <div style={{ marginLeft: '20px' }}>
          <Row>
            $
            {restDetails
              ? restDetails.restaurantTypes?.length > 0
                ? restDetails.restaurantTypes.map((restType) => (
                    <p style={{ fontSize: '16px', marginLeft: '2px' }}>
                      &bull;{restType.restType}
                    </p>
                  ))
                : null
              : null}
          </Row>
          <Row>
            {restDetails ? (
              <p style={{ fontSize: '16px' }}>{restDetails.description}</p>
            ) : null}
          </Row>
        </div>
        <hr />
        <Row>
          <h4 style={{ fontWeight: 'bold', marginLeft: '20px' }}>
            Picked for you
          </h4>
        </Row>
        <div style={{ marginTop: '30px' }}>
          <Row>
            <Col>
              <Row>
                {restDetails
                  ? restDetails.dishes?.length > 0
                    ? restDetails.dishes.map((dish) => (
                        <RestaurantDetailsCard
                          dish={dish}
                          restName={restDetails.name}
                          restId={restDetails.restId}
                          cartInfo={cartInfo}
                        />
                      ))
                    : null
                  : null}
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  );
}

export default RestaurantDetails;
