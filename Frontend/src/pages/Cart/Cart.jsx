/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unreachable */
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
import { Spinner } from 'baseui/spinner';
import { Skeleton } from 'baseui/skeleton';

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
  const [cartPrice, setCartPrice] = useState('');
  const [isUpdatingDishCount, setIsUpdatingDishCount] = useState(false);

  const getCartItems = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(`customers/${decoded.id}/cart`, {
        headers: { Authorization: token },
      });
      if (!response.data.dishesInfo) {
        setCartInfo(null);
        return;
      }
      const dishIdToDishInfo = {};
      response.data.dishesInfo.forEach((dishInfo) => {
        const dishId = dishInfo._id._id;
        dishIdToDishInfo[dishId] = dishInfo._id;
      });
      const dishesInfoFinal = [];
      let calculatedCartPrice = 0;
      response.data.cartItems[0].dishes.forEach((dish) => {
        const temp = dishIdToDishInfo[dish.dishId];
        temp.dishQuantity = dish.dishQuantity;
        calculatedCartPrice += temp.dishQuantity * temp.dishPrice;
        dishesInfoFinal.push(temp);
      });
      response.data.cartItems[0].dishes = dishesInfoFinal;
      setCartInfo({
        cartItems: response.data.cartItems[0],
      });
      setCartPrice(calculatedCartPrice);
    } catch (error) {
      console.log(error);
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
      console.log(error);
      dispatch(clearCartFailure(error.message));
    }
  };

  const updateDishCount = async (dishId, dishQuantity) => {
    // If user selected Remove from dropdown, remove dish from cart
    if (dishQuantity === 'Remove') {
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
        toast.success('Dish removed!');
      } catch (error) {
        console.log(error);
        dispatch(deleteFromFailure(error.message));
      }
      return;
    }
    // Else update dish quantity
    try {
      setIsUpdatingDishCount(true);
      dispatch(addToCartRequest());
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);
      const response = await axiosInstance.post(
        `customers/${decoded.id}/cart`,
        {
          dishes: {
            dishId,
            dishQuantity,
          },
          restId: cartInfo.cartItems.restId._id,
        },
        {
          headers: { Authorization: token },
        },
      );
      dispatch(addToCartSuccess());
      toast.success('Quantity updated!');
      setIsUpdatingDishCount(false);
    } catch (error) {
      console.log(error);
      setIsUpdatingDishCount(false);
      dispatch(addtoCartFailure(error.message));
    }
  };

  useEffect(() => {
    getCartItems();
  }, [cart]);

  const proceedToCheckout = async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      await axiosInstance.post(
        `customers/${decoded.id}/orders/init`,
        {},
        {
          headers: { Authorization: token },
        },
      );
      toast.success('Get ready for tasty food!');
      setCartIsOpen(false);
      history.push('/customer/checkout');
    } catch (error) {
      console.log(error);
    }
  };

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
                ? cartInfo?.cartItems?.restId
                  ? `${cartInfo.cartItems.restId.name} (${cartInfo.cartItems.restId.address})`
                  : null
                : null}
            </Display3>
            <Col>
              {cartInfo ? (
                cartInfo?.cartItems?.dishes?.length > 0 ? (
                  cartInfo.cartItems?.dishes.map((dish) => (
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
                            {isUpdatingDishCount ? (
                              <Skeleton width="100%" height="60%" animation />
                            ) : (
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
                                size={SIZE.default}
                                options={new Array(98).fill().map((e, i) => {
                                  if (i === 0) {
                                    return { dishQuantity: 'Remove' };
                                  }
                                  return { dishQuantity: i };
                                })}
                                placeholder="Quantity"
                                valueKey="dishQuantity"
                                labelKey="dishQuantity"
                                id={dish?._id}
                                value={[{ dishQuantity: dish?.dishQuantity }]}
                                onChange={({ value }) => {
                                  updateDishCount(
                                    dish?._id,
                                    value[0].dishQuantity,
                                  );
                                }}
                              />
                            )}
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
                              {dish?.name}
                            </p>
                            <p
                              style={{
                                marginBottom: '1px',
                                color: '#545454',
                              }}
                            >
                              &#36; {dish?.dishPrice}
                            </p>
                          </div>
                          <img
                            className="col-sm-4"
                            src={
                              dish?.dishImages?.length > 0
                                ? dish.dishImages[0].imageLink
                                : restaurantDefaultImage
                            }
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
              cartInfo?.cartItems?.dishes?.length > 0 ? (
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
                  {isUpdatingDishCount ? (
                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                      <Spinner size="32px" />
                    </div>
                  ) : (
                    <Button
                      style={{ width: '100%', marginTop: '20px' }}
                      size={SIZE.large}
                      onClick={proceedToCheckout}
                    >
                      Go to Checkout • ${' '}
                      {cartPrice
                        ? Math.round((cartPrice + Number.EPSILON) * 100) / 100
                        : ''}
                    </Button>
                  )}
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
