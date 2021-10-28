/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-prototype-builtins */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import jwt_decode from 'jwt-decode';
// import { Card, StyledBody } from 'baseui/card';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Card, StyledBody, StyledThumbnail } from 'baseui/card';

import axiosInstance from '../../services/apiConfig';

import '../../css/RestaurantDishes.css';
import UpdateDishModal from './UpdateDishModal';

function RestaurantDishes() {
  const history = useHistory();
  // const dispatch = useDispatch();
  const [dishes, setDishes] = useState([]);
  const dishesFromState = useSelector((state) => state.dish);
  const [selectedDishId, setSelectedDishId] = useState('');

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const fetchRestaurantDishes = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(
        `restaurants/${decoded.id}/dishes`,
        {
          headers: { Authorization: token },
        },
      );
      setDishes(response.data.dishes);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchRestaurantDishes();
  }, [dishesFromState]);

  return (
    <Container fluid>
      {history.location.pathname !== '/restaurant/dashboard' ? (
        <UpdateDishModal
          setModalIsOpen={setModalIsOpen}
          modalIsOpen={modalIsOpen}
          dishes={dishes}
          selectedDishId={selectedDishId}
        />
      ) : null}
      <Row>
        {dishes.length > 0 ? (
          dishes.map((dish, index) => (
            <Col xs={4} key={index} style={{ marginTop: '30px' }}>
              <div
                onClick={() => {
                  setSelectedDishId(dish._id);
                  setModalIsOpen(true);
                }}
                key={dish._id}
              >
                <Card
                  // overrides={{ Root: { style: { width: '428px' } } }}
                  title={dish.name}
                  className="dishCard"
                >
                  {dish.dishImages.length > 0 ? (
                    <StyledThumbnail src={dish.dishImages[0].imageLink} />
                  ) : (
                    <StyledThumbnail src="https://play-lh.googleusercontent.com/coMv1dl31PCfEs6essJoEUwVryaqKHKQvENdZ_WYpN-PXa8Qfitkg3grQxIVN22W5A" />
                  )}
                  <StyledBody>
                    <span style={{ color: 'grey' }}>{dish.description}</span>
                    <div style={{ position: 'absolute', bottom: 10 }}>
                      ${dish.dishPrice}
                    </div>
                  </StyledBody>
                </Card>
              </div>
            </Col>
          ))
        ) : (
          <h5 style={{ color: 'grey' }}>No dishes added yet...</h5>
        )}
      </Row>
    </Container>
  );
}

export default RestaurantDishes;
