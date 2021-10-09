/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable no-useless-return */
/* eslint-disable no-prototype-builtins */
/* eslint-disable function-paren-newline */
/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
} from 'baseui/modal';
import { Checkbox } from 'baseui/checkbox';
import CheckIndeterminate from 'baseui/icon/check-indeterminate';
import Plus from 'baseui/icon/plus';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';

import '../../css/RestaurantDetailsCard.css';
import { H3, H6 } from 'baseui/typography';
// eslint-disable-next-line object-curly-newline
import { Button, KIND, SHAPE, SIZE } from 'baseui/button';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router';

import axiosInstance from '../../services/apiConfig';
import {
  addtoCartFailure,
  addToCartRequest,
  addToCartSuccess,
  resetCartFailure,
  resetCartRequest,
  resetCartSuccess,
} from '../../actions/cart';

const { Carousel } = require('react-responsive-carousel');

class ModalStateContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isConfirmationOpen: false,
    };
  }

  toggleConfirm = (open = !this.state.isConfirmationOpen, cb = () => {}) => {
    this.setState({ isConfirmationOpen: open }, cb);
  };

  render() {
    return this.props.children({
      isConfirmationOpen: this.state.isConfirmationOpen,
      toggleConfirm: this.toggleConfirm,
    });
  }
}

// eslint-disable-next-line object-curly-newline
function RestaurantDetailsCard({ dish, cartInfo, restName, restId }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dishIngreds, setDishIngreds] = useState([]);
  const [dishQuantity, setDishQuantity] = useState(1);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const ingreds = dish.ingreds.split(',');
    setDishIngreds(ingreds);
  }, [dish.dishId]);

  const resetCartWithDifferentRest = async () => {
    try {
      dispatch(resetCartRequest());
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);
      const response = await axiosInstance.post(
        `customers/${decoded.id}/reset-cart`,
        {
          dishId: dish.dishId,
          name: dish.name,
          dishPrice: dish.dishPrice,
          restId,
        },
        {
          headers: { Authorization: token },
        },
      );
      dispatch(resetCartSuccess());
      toast.success('Cart reset and new item added.');
    } catch (error) {
      dispatch(resetCartFailure(error.response.data.error));
      toast.error(error.response.data.error);
    }
  };

  const addToCart = async (toggleConfirm) => {
    try {
      dispatch(addToCartRequest());
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);

      const promises = [...Array(dishQuantity)].map(
        (_, i) =>
          new Promise((resolve, reject) => {
            try {
              const response = axiosInstance.post(
                `customers/${decoded.id}/cart`,
                {
                  dishId: dish.dishId,
                  restId: dish.restId,
                },
                {
                  headers: { Authorization: token },
                },
              );
              resolve(response);
            } catch (error) {
              if (error.hasOwnProperty('response')) {
                if (error.response.status === 403) {
                  toast.error('Session expired. Please login again!');
                  history.push('/login/restaurant');
                  reject(error);
                  return;
                }
                reject(error.response.data.error);
                toast.error(error.response.data.error);
              }
            }
          }),
      );
      const response = await Promise.all([...promises]);
      // Check here if customer adds stuff from another restaurant...
      if (!response[0].data.cartEntry) {
        toggleConfirm(true);
        return;
      }
      dispatch(addToCartSuccess());
      toast.success('Item added to cart!');
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/restaurant');
        }
      }
      dispatch(addtoCartFailure(error.response.data.error));
      toast.error(error.response.data.error);
    }
  };

  return (
    <>
      <ModalStateContainer>
        {({ isConfirmationOpen, toggleConfirm }) => (
          <>
            <Modal
              onClose={() => setModalIsOpen(false)}
              isOpen={modalIsOpen}
              overrides={{
                // eslint-disable-next-line baseui/deprecated-component-api
                Backdrop: {
                  style: {
                    bottom: '-10px',
                  },
                },
              }}
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
                    onClick={() => addToCart(toggleConfirm)}
                  >
                    <span style={{ justifyContent: 'center' }}>
                      Add to cart
                    </span>
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
            <Modal
              onClose={() => toggleConfirm(false)}
              isOpen={isConfirmationOpen}
            >
              <ModalHeader>Create new order?</ModalHeader>
              <ModalBody>
                Your cart already contains items from {cartInfo?.rest?.name}.
                Create a new order to add items from {restName || ''}?
              </ModalBody>
              <ModalFooter>
                <ModalButton
                  kind="tertiary"
                  onClick={() => toggleConfirm(false)}
                >
                  Cancel
                </ModalButton>

                <ModalButton
                  onClick={async () => {
                    toggleConfirm(false, () => setModalIsOpen(false));
                    resetCartWithDifferentRest();
                  }}
                >
                  Create new order
                </ModalButton>
              </ModalFooter>
            </Modal>
          </>
        )}
      </ModalStateContainer>

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