import React from 'react';
import { Col, Row } from 'react-bootstrap';
import AddDishModal from './AddDishModal';
import RestaurantDishes from './RestaurantDishes';

const {
  ButtonContainer,
  ButtonRow,
  ButtonMod,
} = require('../../components/Button');

function RestaurantMenu() {
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  return (
    <div style={{ marginLeft: '25px', marginTop: '25px' }}>
      <AddDishModal setModalIsOpen={setModalIsOpen} modalIsOpen={modalIsOpen} />
      <Row>
        <Col xs={10}>
          <h1 style={{ fontWeight: 'bolder' }}>Manage menu</h1>
          <h5>Click on dish to update details</h5>
        </Col>
        <Col xs={2}>
          <ButtonContainer>
            <ButtonRow>
              <ButtonMod
                type="submit"
                style={{ width: '92%' }}
                onClick={() => setModalIsOpen(true)}
              >
                Add new dish
              </ButtonMod>
            </ButtonRow>
          </ButtonContainer>
        </Col>
      </Row>
      <RestaurantDishes />
    </div>
  );
}

export default RestaurantMenu;
