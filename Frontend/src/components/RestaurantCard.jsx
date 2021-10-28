/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { createTheme, lightThemePrimitives, ThemeProvider } from 'baseui';
import { Button, SHAPE, SIZE } from 'baseui/button';
import { useHistory } from 'react-router';
import { H6 } from 'baseui/typography';
import React from 'react';
import { Card, Col } from 'react-bootstrap';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import toast from 'react-hot-toast';

import axiosInstance from '../services/apiConfig';

import HeartSvg from './HeartSvg';
import ticketSmall from '../assets/img/ticket-small.png';
import restaurantDefaultImage from '../assets/img/rest-default.jpg';
import '../css/CustomerHome.css';

function RestaurantCard(props) {
  const { restData } = props;
  console.log(restData);
  const history = useHistory();

  const gotoRestaurantDetails = () => {
    history.push(`/customer/restaurants/${restData._id}`);
  };

  const addRestToFavs = async (restId) => {
    try {
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);
      const response = await axiosInstance.post(
        `customers/${decoded.id}/favourites`,
        {
          restId,
        },
        {
          headers: { Authorization: token },
        },
      );
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Col xs={3} style={{ marginTop: '80px' }} {...props}>
      <div
        onClick={gotoRestaurantDetails}
        className="cardHover"
        key={restData.restId}
      >
        <Card className="border-0">
          <div className="img-overlay-wrap">
            <Card.Img
              variant="top"
              src={
                restData.restImages?.length > 0
                  ? restData.restImages[0].imageLink
                  : restaurantDefaultImage
              }
            />
            <div
              onClick={(e) => {
                addRestToFavs(restData._id);
                e.stopPropagation();
              }}
            >
              <HeartSvg />
            </div>
          </div>
          <Card.Body>
            <div style={{ position: 'absolute', left: 0, right: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <H6>{restData.name}</H6>
                <ThemeProvider
                  theme={createTheme(lightThemePrimitives, {
                    colors: {
                      buttonPrimaryFill: '#EEEEEE',
                      buttonPrimaryText: '#000000',
                    },
                  })}
                >
                  <Button size={SIZE.mini} shape={SHAPE.circle}>
                    {(Math.random() * (5.0 - 3.5) + 3.5).toFixed(1)}
                  </Button>
                </ThemeProvider>
              </div>
              <div style={{ display: 'flex' }}>
                <img
                  src={ticketSmall}
                  width="20px"
                  height="20px"
                  alt="ticket"
                />
                <p>&bull; $0.49 Delivery fee &bull; </p>
                <p style={{ color: 'grey' }}> 25-35 min</p>
              </div>
            </div>
            {/* <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make
          up the bulk of the cards content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button> */}
          </Card.Body>
        </Card>
      </div>
    </Col>
  );
}

export default RestaurantCard;
