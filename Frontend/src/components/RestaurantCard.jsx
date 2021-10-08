/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { createTheme, lightThemePrimitives, ThemeProvider } from 'baseui';
import { Button, SHAPE, SIZE } from 'baseui/button';
import { useHistory } from 'react-router';
import { H6 } from 'baseui/typography';
import React from 'react';
import { Card, Col } from 'react-bootstrap';
import HeartSvg from './HeartSvg';
import ticketSmall from '../assets/img/ticket-small.png';
import restaurantDefaultImage from '../assets/img/rest-default.jpg';
import '../css/CustomerHome.css';

function RestaurantCard(props) {
  const { restData } = props;
  const history = useHistory();

  const gotoRestaurantDetails = () => {
    history.push(`/customer/restaurants/${restData.restId}`);
  };

  return (
    <Col xs={3} style={{ marginTop: '80px' }}>
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
                restData.restaurantImages?.length > 0
                  ? restData.restaurantImages[0].imageLink
                  : restaurantDefaultImage
              }
            />
            {/* TODO: add to favourites from here */}
            <HeartSvg />
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
                  <Button
                    size={SIZE.mini}
                    shape={SHAPE.circle}
                  >
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
