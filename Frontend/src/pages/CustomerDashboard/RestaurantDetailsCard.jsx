/* eslint-disable function-paren-newline */
/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import {
  Modal,
  ModalFooter,
} from 'baseui/modal';
import { Checkbox } from 'baseui/checkbox';
import CheckIndeterminate from 'baseui/icon/check-indeterminate';
import Plus from 'baseui/icon/plus';

import '../../css/RestaurantDetailsCard.css';
import { H3, H6 } from 'baseui/typography';
// eslint-disable-next-line object-curly-newline
import { Button, KIND, SHAPE, SIZE } from 'baseui/button';

const { Carousel } = require('react-responsive-carousel');

function RestaurantDetailsCard({ dish }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dishIngreds, setDishIngreds] = useState([]);
  const [dishQuantity, setDishQuantity] = useState(1);

  useEffect(() => {
    const ingreds = dish.ingreds.split(',');
    setDishIngreds(ingreds);
  }, [dish.dishId]);

  return (
    <>
      <Modal
        onClose={() => setModalIsOpen(false)}
        isOpen={modalIsOpen}
        // overrides={{
        //   Dialog: {
        //     style: {
        //       width: '30vw',
        //       height: '85vh',
        //       position: 'fixed',
        //     },
        //   },
        // }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Carousel
            showIndicators={false}
            showThumbs={false}
            key={dish?.dishId}
            dynamicHeight
            width="100%"
          >
            {dish.dishImages
              ? dish.dishImages.map((ele) => (
                  <div key={ele.dishImageId}>
                    <img src={ele.imageLink} alt="Dish" />
                  </div>
                ))
              : null}
          </Carousel>
          <div style={{ padding: '20px' }}>
            <H3>{dish?.name}</H3>
            <p>{dish?.description}</p>
          </div>
          <div
            style={{
              display: 'flex',
              height: '60px',
              backgroundColor: '#F6F6F6',
            }}
          >
            <h5 style={{ padding: '20px' }}>Ingredients</h5>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
            }}
          >
            {dishIngreds?.length > 0
              ? dishIngreds.map((ingred) =>
                  ingred !== '' ? (
                    <Checkbox checked disabled>
                      {ingred}
                    </Checkbox>
                  ) : null,
                )
              : null}
          </div>
        </div>
        <ModalFooter>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginLeft: '-12px',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', marginRight: '15px' }}>
              <Button
                onClick={() => {
                  const newQty = dishQuantity - 1;
                  if (newQty > 0) setDishQuantity(newQty);
                }}
                disabled={dishQuantity === 1}
                kind={KIND.secondary}
                size={SIZE.large}
                shape={SHAPE.circle}
              >
                <CheckIndeterminate />
              </Button>
              <H6 $style={{ marginLeft: '10px', marginTop: '10px' }}>
                {dishQuantity}
              </H6>
              <Button
                $style={{ marginLeft: '10px' }}
                onClick={() => {
                  const newQty = dishQuantity + 1;
                  setDishQuantity(newQty);
                }}
                size={SIZE.large}
                kind={KIND.secondary}
                shape={SHAPE.circle}
              >
                <Plus />
              </Button>
            </div>
            <Button
              $style={{
                width: '90%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ justifyContent: 'center' }}>Add to cart</span>
              <span style={{ textAlign: 'right' }}>
                &#36;
                {Math.round(
                  (dish?.dishPrice * dishQuantity + Number.EPSILON) * 100,
                ) / 100}
              </span>
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      <Col xs={4} style={{ marginTop: '40px' }}>
        <div
          className="card restaurantDetailsCard"
          onClick={() => setModalIsOpen(true)}
        >
          <div
            className="row"
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <div
              className="col-sm-6"
              style={{
                marginLeft: '15px',
                marginTop: '15px',
              }}
            >
              <p style={{ marginBottom: '2px', fontWeight: 'bold' }}>
                {dish.name}
              </p>
              <p style={{ marginBottom: '1px', color: '#545454' }}>
                {dish.description}
              </p>
            </div>
            {/* <div
            className="col-sm-6"
            style={{ marginLeft: '15px', marginTop: '15px' }}
          >
            {dish.description}
          </div> */}
            <img
              className="col-sm-4"
              src={dish.dishImages[0].imageLink}
              alt="sans"
              height="120px"
            />
            <div
              className="col-sm-4"
              style={{ position: 'absolute', bottom: '10px', left: '0px' }}
            >
              &#36;
              {dish.dishPrice}
            </div>
          </div>
        </div>
      </Col>
    </>
  );
}

export default RestaurantDetailsCard;
