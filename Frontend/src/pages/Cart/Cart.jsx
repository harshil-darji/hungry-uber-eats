/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-prototype-builtins */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';
import toast from 'react-hot-toast';
import { Button, KIND, SIZE } from 'baseui/button';
import { Display3, H4, H6 } from 'baseui/typography';
import { Col } from 'react-bootstrap';
import { ANCHOR, Drawer } from 'baseui/drawer';
import { Select } from 'baseui/select';
import { createTheme, lightThemePrimitives, ThemeProvider } from 'baseui';

import axiosInstance from '../../services/apiConfig';
import {
  addtoCartFailure,
  addToCartRequest,
  addToCartSuccess,
  clearCartFailure,
  clearCartRequest,
  clearCartSuccess,
  deleteFromCartRequest,
  deleteFromCartSuccess,
  deleteFromFailure,
  updateCartFailure,
  updateCartRequest,
  updateCartSuccess,
} from '../../actions/cart';

import restaurantDefaultImage from '../../assets/img/rest-default.jpg';

function Cart(props) {
  // eslint-disable-next-line object-curly-newline
  const { setCartIsOpen, cartIsOpen } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const [cartInfo, setCartInfo] = useState(null);
  const [dishImages, setDishImages] = useState({});

  const getCartItems = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(`customers/${decoded.id}/cart`, {
        headers: { Authorization: token },
      });
      if (response.data.length === 0) {
        console.log(response.data);
        setCartInfo(null);
        return;
      }
      // Sort dishes in ascending order by Name...
      const sortedCartItems = []
        .concat(response.data.cartItems)
        .sort((a, b) => (a.dish.name > b.dish.name ? 1 : -1));
      // set cartItems array to sorted array and rest as it is...
      setCartInfo({ ...response.data, cartItems: sortedCartItems });

      const tempDishObj = {};
      // IDK whats goin on here... Im just assigning dishimage from response.
      // TODO: fix this to get data appropriately from backend
      response.data.cartDishImages.forEach((dishObj) => {
        tempDishObj[dishObj.dish.dishId] =
          dishObj.dish.dishImages.length > 0
            ? dishObj.dish.dishImages[0].imageLink
            : restaurantDefaultImage;
      });
      setDishImages(tempDishObj);
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/customer');
        }
      }
    }
  }, []);

  const clearCart = async () => {
    dispatch(clearCartRequest());
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.delete(
        `customers/${decoded.id}/clear-cart`,
        {
          headers: { Authorization: token },
        },
      );
      dispatch(clearCartSuccess());
      toast.success('Cart cleared!');
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/customer');
          return;
        }
        toast.error(error.response.data.error);
        dispatch(clearCartFailure(error.response.data.error));
      }
    }
  };

  const updateDishCount = async (dishId, dishCount) => {
    if (dishCount === 'Remove') {
      // remove this dish from cart
      dispatch(deleteFromCartRequest());
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);
      try {
        const response = await axiosInstance.delete(
          `customers/${decoded.id}/cart/${dishId}`,
          {
            headers: { Authorization: token },
          },
        );
        dispatch(deleteFromCartSuccess());
      } catch (error) {
        if (error.hasOwnProperty('response')) {
          if (error.response.status === 403) {
            toast.error('Session expired. Please login again!');
            history.push('/login/customer');
            return;
          }
          toast.error(error.response.data.error);
          dispatch(deleteFromFailure(error.response.data.error));
        }
      }
      return;
    }
    // else update dish count and total count for navbar
    const cartDishes = cartInfo.cartItems;
    cartDishes.forEach((cartItem) => {
      if (cartItem.dish.dishId === dishId) {
        cartItem.dishCount = dishCount;
      }
    });
    setCartInfo({ ...cartInfo, cartItems: cartDishes });

    dispatch(updateCartRequest());
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.put(
        `customers/${decoded.id}/cart/${dishId}`,
        {
          restId: cartInfo.rest.restId,
          dishCount,
        },
        {
          headers: { Authorization: token },
        },
      );
      dispatch(updateCartSuccess());
      toast.success('Quantity updated!');
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/customer');
          return;
        }
        toast.error(error.response.data.error);
        dispatch(updateCartFailure(error.response.data.error));
      }
    }
    // make API call to update dish count for particular dish ID
  };

  useEffect(() => {
    getCartItems();
  }, [cart]);

  return (
    <>
      <Drawer
        onClose={() => setCartIsOpen(false)}
        autoFocus
        anchor={ANCHOR.right}
        isOpen={cartIsOpen}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            minHeight: 'calc(100vh - 100px)',
          }}
        >
          <div style={{ padding: '10px' }}>
            <Display3 $style={{ fontWeight: 'normal' }}>
              {cartInfo
                ? cartInfo?.rest
                  ? `${cartInfo.rest.name} (${cartInfo.rest.address})`
                  : null
                : null}
            </Display3>
            <Col>
              {cartInfo ? (
                cartInfo?.cartItems?.length > 0 ? (
                  cartInfo.cartItems.map((dish) => (
                    <>
                      <div
                        style={{ marginTop: '40px' }}
                        className="card border-0"
                      >
                        <div
                          className="row"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div className="col-sm-3">
                            <Select
                              overrides={{
                                Dropdown: {
                                  style: {
                                    width: '90px',
                                    textAlign: 'center',
                                  },
                                },
                              }}
                              clearable={false}
                              size={SIZE.mini}
                              options={new Array(98).fill().map((e, i) => {
                                if (i === 0) {
                                  return { dishCount: 'Remove' };
                                }
                                return { dishCount: i };
                              })}
                              placeholder="Quantity"
                              valueKey="dishCount"
                              labelKey="dishCount"
                              id={dish?.dish.dishId}
                              value={[{ dishCount: dish?.dishCount }]}
                              onChange={({ value }) => {
                                updateDishCount(
                                  dish?.dish.dishId,
                                  value[0].dishCount,
                                );
                              }}
                            />
                          </div>
                          <div
                            className="col-sm-4"
                            style={{
                              marginLeft: '15px',
                              marginTop: '15px',
                            }}
                          >
                            <p
                              style={{
                                marginBottom: '2px',
                                fontWeight: 'bold',
                              }}
                            >
                              {dish?.dish.name}
                            </p>
                            <p
                              style={{
                                marginBottom: '1px',
                                color: '#545454',
                              }}
                            >
                              &#36; {dish?.dish.dishPrice}
                            </p>
                          </div>
                          <img
                            className="col-sm-4"
                            src={dishImages[dish?.dish.dishId]}
                            alt="sans"
                            height="80px"
                          />
                        </div>
                      </div>
                      <hr />
                    </>
                  ))
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '80vh',
                    }}
                  >
                    <img
                      src="https://www.ubereats.com/_static/dff11ef79683e12df0d88de39961997d.svg"
                      alt="cart"
                    />
                    <H6>Add items to start a cart</H6>
                  </div>
                )
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh',
                  }}
                >
                  <img
                    src="https://www.ubereats.com/_static/dff11ef79683e12df0d88de39961997d.svg"
                    alt="cart"
                  />
                  <H6>Add items to start a cart</H6>
                </div>
              )}
            </Col>
          </div>

          <div>
            {cartInfo ? (
              cartInfo?.cartItems?.length > 0 ? (
                <>
                  <ThemeProvider
                    theme={createTheme(lightThemePrimitives, {
                      colors: { buttonMinimalText: '#ff0000' },
                    })}
                  >
                    <Button
                      style={{ width: '100%' }}
                      onClick={clearCart}
                      kind={KIND.minimal}
                    >
                      Clear cart
                    </Button>
                  </ThemeProvider>
                  <Button
                    style={{ width: '100%', marginTop: '20px' }}
                    size={SIZE.large}
                  >
                    Go to Checkout &#9679; jajaja
                  </Button>
                </>
              ) : null
            ) : null}
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default Cart;
