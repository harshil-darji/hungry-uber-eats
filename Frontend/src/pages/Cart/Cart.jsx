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
import { Display3 } from 'baseui/typography';
import { Col } from 'react-bootstrap';
import { ANCHOR, Drawer } from 'baseui/drawer';
import { Select } from 'baseui/select';
import { createTheme, lightThemePrimitives, ThemeProvider } from 'baseui';

import axiosInstance from '../../services/apiConfig';
import {
  deleteFromCartRequest,
  deleteFromCartSuccess,
  deleteFromFailure,
} from '../../actions/cart';

function Cart(props) {
  // eslint-disable-next-line object-curly-newline
  const { setCartIsOpen, cartIsOpen } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const [cartInfo, setCartInfo] = useState({});

  const getCartItems = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(`customers/${decoded.id}/cart`, {
        headers: { Authorization: token },
      });
      setCartInfo(response.data);
      console.log('Get cart called');
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/customer');
        }
      }
    }
  }, []);

  const clearCart = () => {
    console.log('clear cart here');
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
              {cartInfo
                ? cartInfo?.cartItems?.length > 0
                  ? cartInfo.cartItems.map((dish) => (
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
                                id={dish.dish.dishId}
                                value={[{ dishCount: dish.dishCount }]}
                                onChange={({ value }) => {
                                  updateDishCount(
                                    dish.dish.dishId,
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
                                {dish.dish.name}
                              </p>
                              <p
                                style={{
                                  marginBottom: '1px',
                                  color: '#545454',
                                }}
                              >
                                &#36; {dish.dish.dishPrice}
                              </p>
                            </div>
                            <img
                              className="col-sm-4"
                              src="https://ubereatsmedia.s3.amazonaws.com/trupti.jpg"
                              alt="sans"
                              height="80px"
                            />
                          </div>
                        </div>
                        <hr />
                      </>
                    ))
                  : null
                : null}
            </Col>
          </div>

          <div>
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
              Sign in
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default Cart;
