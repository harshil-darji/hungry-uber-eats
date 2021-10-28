/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-prototype-builtins */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable operator-linebreak */
// import { createTheme, lightThemePrimitives, ThemeProvider } from 'baseui';
import { Block } from 'baseui/block';
// eslint-disable-next-line object-curly-newline
import { Button, KIND, SHAPE, SIZE } from 'baseui/button';
import {
  ALIGN,
  HeaderNavigation,
  StyledNavigationList,
} from 'baseui/header-navigation';
// import { Menu } from 'baseui/icon';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router';
import { Skeleton } from 'baseui/skeleton';
import { Display4, H2, H6 } from 'baseui/typography';
import { ButtonGroup, MODE } from 'baseui/button-group';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  // ModalButton,
} from 'baseui/modal';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';

import UberEatsSvg from '../../components/UberEatsSvg';
import restaurantDefaultImage from '../../assets/img/rest-default.jpg';

import axiosInstance from '../../services/apiConfig';

import '../../css/CustomerCheckout.css';

// const {
//   ButtonContainer,
//   ButtonRow,
//   ButtonMod,
// } = require('../../components/Button');

function CustomerCheckout() {
  const history = useHistory();
  const [checkoutDetails, setCheckoutDetails] = useState(null);
  const [deliveryTypeselected, setDeliveryTypeselected] = useState('');
  const [locationObj, setLocationObj] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [inputCustomerAddress, setInputCustomerAddress] = useState('');
  const [customerAddresses, setCustomerAddresses] = useState([]);
  const [addressToSend, setAddressToSend] = useState('');

  const fetchCheckoutDetails = async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(
        `customers/${decoded.id}/latest-order`,
        {
          headers: { Authorization: token },
        },
      );
      setCheckoutDetails(response.data.latestOrder);
      if (response.data.latestOrder.restaurant.deliveryType === 'Both') {
        setDeliveryTypeselected('Delivery');
      } else {
        setDeliveryTypeselected(
          response.data.latestOrder.restaurant.deliveryType,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCustomerAddresses = async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(
        `customers/${decoded.id}/addresses`,
        {
          headers: { Authorization: token },
        },
      );
      setCustomerAddresses(response.data.existingAddresses);
      if (response.data.existingAddresses.length > 0) {
        setAddressToSend(response.data.existingAddresses[0].address);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLocation = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function success(pos) {
      const crd = pos.coords;
      const reqUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${crd.latitude}&lon=${crd.longitude}`;

      const xmlHttp = new XMLHttpRequest();
      xmlHttp.open('GET', reqUrl, false);
      xmlHttp.send(null);
      const responseObj = JSON.parse(xmlHttp.responseText);
      setLocationObj(responseObj);
    }

    function error() {
      toast.error('Error fetching current location!');
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  };

  const placeOrder = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);
      await axiosInstance.post(
        `customers/${decoded.id}/orders/create`,
        {
          orderAddress: addressToSend,
          orderType: deliveryTypeselected,
        },
        {
          headers: { Authorization: token },
        },
      );
      if (deliveryTypeselected === 'Delivery') {
        toast.success('Order placed! Tasty food is on the way!');
        history.push('/customer/orders');
        return;
      }
      toast.success('Order placed!');
      history.push('/customer/orders');
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 400) {
          history.push('/customer/dashboard');
          return;
        }
      }
      console.log(error);
    }
  };

  const saveCustomerAddress = async () => {
    if (inputCustomerAddress.length === 0) {
      setModalIsOpen(false);
      return;
    }
    try {
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);
      await axiosInstance.post(
        `customers/${decoded.id}/addresses`,
        {
          address: inputCustomerAddress,
        },
        {
          headers: { Authorization: token },
        },
      );
      getCustomerAddresses();
      setInputCustomerAddress('');
      toast.success('Address added');
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCustomerAddress = async (id) => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      await axiosInstance.delete(`customers/${decoded.id}/addresses/${id}`, {
        headers: { Authorization: token },
      });
      getCustomerAddresses();
      toast.success('Address deleted');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCheckoutDetails();
    getLocation();
    getCustomerAddresses();
  }, []);

  // TODO: add drawer menu left side on navbar if time persists bruh.
  return (
    <div>
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
        <ModalHeader>
          <H2 style={{ fontWeight: 'normal' }}>Deliver to</H2>
        </ModalHeader>
        <ModalBody>
          <FormControl>
            <Input
              startEnhancer={
                <i
                  className="fa fa-map-marker fa-lg"
                  style={{ marginBottom: '12px' }}
                  aria-hidden="true"
                />
              }
              size={SIZE.large}
              required
              id="address"
              autoComplete="off"
              placeholder="Enter delivery address"
              value={inputCustomerAddress}
              onChange={(e) => setInputCustomerAddress(e.target.value)}
            />
          </FormControl>

          {customerAddresses
            ? customerAddresses.length > 0
              ? customerAddresses.map((address) => (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginLeft: '10px',
                      marginBottom: '5px',
                      cursor: 'pointer',
                    }}
                    className="rowHover"
                    onClick={() => {
                      setAddressToSend(address.address);
                      setModalIsOpen(false);
                    }}
                  >
                    <i
                      className="fa fa-map-marker fa-lg"
                      aria-hidden="true"
                      siz
                      style={{ marginBottom: '9px' }}
                    />
                    <Col>
                      <p style={{ fontWeight: 'bold' }}>
                        {address.address || 'Enter address'}
                      </p>
                      <p style={{ marginTop: '-14px', fontSize: '14px' }}>
                        Deliver here
                      </p>
                    </Col>
                    <Button
                      style={{ marginRight: '10px' }}
                      onClick={() => deleteCustomerAddress(address.id)}
                      kind={KIND.secondary}
                      shape={SHAPE.circle}
                      size={SIZE.default}
                    >
                      <i
                        className="fa fa-trash fa-lg"
                        style={{
                          color: 'red',
                          marginLeft: '20px',
                          marginBottom: '10px',
                        }}
                        aria-hidden="true"
                      />
                    </Button>
                    {/* <Button
                      kind={KIND.secondary}
                      shape={SHAPE.circle}
                      size={SIZE.default}
                    >
                      <i
                        className="fa fa-pencil fa-lg"
                        style={{
                          color: 'grey',
                          marginLeft: '20px',
                          marginBottom: '10px',
                        }}
                        aria-hidden="true"
                      />
                    </Button> */}
                  </div>
                ))
              : null
            : null}
        </ModalBody>
        <ModalFooter>
          <Button
            $style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
            onClick={saveCustomerAddress}
          >
            <span style={{ justifyContent: 'center' }}>Done</span>
          </Button>
        </ModalFooter>
      </Modal>
      <HeaderNavigation>
        <StyledNavigationList $align={ALIGN.left}>
          <Row
            style={{
              alignItems: 'flex-start',
              width: '100vw',
              marginLeft: '25px',
            }}
          >
            <Row style={{ alignItems: 'flex-start', display: 'flex' }}>
              {/* <ThemeProvider
                theme={createTheme(lightThemePrimitives, {
                  colors: { buttonMinimalHover: '#FFFFFF' },
                })}
              >
                <Button kind={KIND.minimal}>
                  <Menu size={25} />
                </Button>
              </ThemeProvider> */}
              <Block
                style={{ marginLeft: '20px' }}
                onClick={() => history.push('/customer/dashboard')}
              >
                <UberEatsSvg />
              </Block>
            </Row>
          </Row>
        </StyledNavigationList>
      </HeaderNavigation>
      <Row>
        {checkoutDetails?.restaurant ? (
          <Col style={{ marginLeft: '30px', marginTop: '50px' }}>
            <Display4 $style={{ fontWeight: 'normal' }}>
              {checkoutDetails.restaurant.name}
              {` (${checkoutDetails.restaurant.address})`}
            </Display4>
            <div className="restImageWrapper" style={{ marginTop: '30px' }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '100px',
                  padding: '5px',
                  height: '48px',
                  boxSizing: 'border-box',
                  position: 'absolute',
                  marginTop: '10px',
                  marginLeft: '10px',
                  zIndex: 100,
                }}
              >
                {checkoutDetails?.restaurant.deliveryType === 'Both' ? (
                  <ButtonGroup
                    mode={MODE.radio}
                    shape={SHAPE.pill}
                    kind={KIND.minimal}
                    size={SIZE.compact}
                    selected={deliveryTypeselected}
                    onClick={(event) => {
                      setDeliveryTypeselected(event.target.innerText);
                    }}
                  >
                    <Button
                      style={
                        deliveryTypeselected === 'Delivery'
                          ? { backgroundColor: 'black', color: 'white' }
                          : {}
                      }
                    >
                      Delivery
                    </Button>
                    <Button
                      style={
                        deliveryTypeselected === 'Pickup'
                          ? { backgroundColor: 'black', color: 'white' }
                          : {}
                      }
                    >
                      Pickup
                    </Button>
                  </ButtonGroup>
                ) : checkoutDetails?.restaurant.deliveryType === 'Pickup' ? (
                  <Button shape={SHAPE.pill} style={{ height: '38px' }}>
                    Pickup
                  </Button>
                ) : (
                  <Button shape={SHAPE.pill} style={{ height: '38px' }}>
                    Delivery
                  </Button>
                )}
              </div>

              <img
                src={
                  checkoutDetails.restaurant.restaurantImages.length > 0
                    ? checkoutDetails.restaurant.restaurantImages[0].imageLink
                    : restaurantDefaultImage
                }
                height="400px"
                // width="650px"
                style={{ display: 'inline-block', overflow: 'hidden' }}
                alt={checkoutDetails.restaurant.name}
              />
            </div>

            <div
              style={{
                marginLeft: '10px',
                marginTop: '20px',
                display: 'flex',
                width: '590px',
                justifyContent: 'space-between',
              }}
            >
              <i
                className="fa fa-map-marker fa-lg"
                aria-hidden="true"
                siz
                style={{ marginBottom: '9px' }}
              />
              <Col>
                <p style={{ fontWeight: 'bold' }}>
                  {addressToSend.length > 0
                    ? addressToSend
                    : locationObj
                    ? locationObj.address.road
                    : 'Enter address'}
                </p>
                <p style={{ marginTop: '-14px', fontSize: '14px' }}>
                  Edit your address
                </p>
              </Col>
              <Button
                onClick={() => setModalIsOpen(true)}
                kind={KIND.secondary}
                shape={SHAPE.pill}
                size={SIZE.default}
                style={{ height: '50px', width: '70px' }}
              >
                Edit
              </Button>
            </div>

            <hr style={{ width: '600px', float: 'left' }} />

            <div
              style={{
                marginLeft: '10px',
                marginTop: '20px',
                display: 'flex',
                width: '590px',
                justifyContent: 'space-between',
              }}
            >
              <i
                className="fa fa-male fa-lg"
                aria-hidden="true"
                style={{ marginBottom: '9px' }}
              />
              <Col>
                <p style={{ fontWeight: 'bold' }}>Meet at your door</p>
                {/* <p
                  style={{
                    marginTop: '-14px',
                    fontSize: '14px',
                    color: 'grey',
                  }}
                >
                  Add delivery instructions
                </p> */}
              </Col>
              {/* <Button
                kind={KIND.secondary}
                shape={SHAPE.pill}
                size={SIZE.default}
                style={{ height: '50px', width: '70px' }}
              >
                Edit
              </Button> */}
            </div>

            <div
              style={{
                marginLeft: '10px',
                marginTop: '20px',
                display: 'flex',
                width: '590px',
                flexDirection: 'column',
              }}
            >
              <hr style={{ height: '3px', width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <H6 style={{ fontWeight: 'normal' }}>Delivery estimate</H6>
                <p style={{ fontSize: '18px' }}>20-30 min</p>
              </div>
            </div>
          </Col>
        ) : (
          <Col>
            <Skeleton width="100%" height="100%" animation />
          </Col>
        )}
        {/* Right side column below */}
        <Col xs={5} style={{ backgroundColor: '#F6F6F6', height: '100vh' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '100px',
            }}
          >
            <Col xs={10}>
              <Button
                onClick={placeOrder}
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#148D4B',
                  height: '60px',
                }}
              >
                Place order
              </Button>
              <p style={{ marginTop: '10px', fontSize: '12px', color: 'grey' }}>
                If you’re not around when the delivery person arrives, they’ll
                leave your order at the door. By placing your order, you agree
                to take full responsibility for it once it’s delivered.
              </p>
              <hr />
              <div
                style={{
                  marginTop: '10px',
                  marginLeft: '1px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <p>Subtotal</p>
                <p>
                  $
                  {checkoutDetails ? (
                    checkoutDetails.price
                  ) : (
                    <Skeleton width="40px" height="20px" animation />
                  )}
                </p>
              </div>
              <div
                style={{
                  marginTop: '1px',
                  marginLeft: '1px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <p>
                  Taxes and fees
                  <i
                    className="fa fa-info-circle"
                    aria-hidden="true"
                    style={{ color: 'grey', marginLeft: '10px' }}
                  />
                </p>
                <p>
                  $
                  <span>
                    {checkoutDetails ? (
                      Math.round(
                        (checkoutDetails.taxPrice - 0.49 + Number.EPSILON) *
                          100,
                      ) / 100
                    ) : (
                      <Skeleton width="40px" height="20px" animation />
                    )}
                  </span>
                </p>
              </div>
              <div
                style={{
                  marginTop: '-5px',
                  marginLeft: '1px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <p>
                  Delivery Fee
                  <i
                    className="fa fa-info-circle"
                    aria-hidden="true"
                    style={{ color: 'grey', marginLeft: '10px' }}
                  />
                </p>
                <p>
                  {checkoutDetails ? (
                    <span>&#36;0.49</span>
                  ) : (
                    <Skeleton width="40px" height="20px" animation />
                  )}
                </p>
              </div>
              <hr />
              <div
                style={{
                  marginTop: '10px',
                  marginLeft: '1px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <p style={{ fontWeight: 'bold', fontSize: 'larger' }}>Total</p>
                <p style={{ fontWeight: 'bold', fontSize: 'larger' }}>
                  $
                  {checkoutDetails ? (
                    checkoutDetails.totalPrice
                  ) : (
                    <Skeleton width="40px" height="20px" animation />
                  )}
                </p>
              </div>
            </Col>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default CustomerCheckout;
