/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable camelcase */
/* eslint-disable baseui/deprecated-component-api */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-no-bind */
// eslint-disable-next-line object-curly-newline
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Nav, Col } from 'react-bootstrap';
import { Menu } from 'baseui/icon';
import toast from 'react-hot-toast';
import { Block } from 'baseui/block';
import { ButtonGroup, SHAPE, MODE } from 'baseui/button-group';
import { Button, KIND, SIZE } from 'baseui/button';
import { H2 } from 'baseui/typography';
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationList,
  StyledNavigationItem,
} from 'baseui/header-navigation';
import { TYPE } from 'baseui/select';
import { Drawer, ANCHOR } from 'baseui/drawer';
import { ThemeProvider, createTheme, lightThemePrimitives } from 'baseui';
import jwt_decode from 'jwt-decode';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  // ModalButton,
} from 'baseui/modal';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';

import axiosInstance from '../../services/apiConfig';
import {
  setLocation,
  setReduxDeliveryType,
  setReduxSearchQuery,
} from '../../actions/searchFilter';

import UberEatsSquareSvg from '../../components/UberEatsSquareSvg';
import UberEatsSvg from '../../components/UberEatsSvg';
import CustomerProfileMenu from '../../components/CustomerProfileMenu';
import { logoutCustomer } from '../../actions/customer';
import '../../css/CustomerNavbar.css';
import Cart from '../Cart/Cart';

export default function CustomerNavbar() {
  const history = useHistory();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [deliveryTypeselected, setDeliveryTypeselected] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // This is for navigation sidebar on left side
  const [cartIsOpen, setCartIsOpen] = useState(false); // this is drawer on right for cart
  const [totalDishesInCart, setTotalDishesInCart] = useState(0);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [inputCustomerAddress, setInputCustomerAddress] = useState('');
  const [inputCustomerCity, setInputCustomerCity] = useState('');
  const [customerAddresses, setCustomerAddresses] = useState([]);
  const [addressToSend, setAddressToSend] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // const getLocation = () => {
  //   const options = {
  //     enableHighAccuracy: true,
  //     timeout: 5000,
  //     maximumAge: 0,
  //   };

  //   function success(pos) {
  //     const crd = pos.coords;
  //     const reqUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${crd.latitude}&lon=${crd.longitude}`;

  //     const xmlHttp = new XMLHttpRequest();
  //     xmlHttp.open('GET', reqUrl, false);
  //     xmlHttp.send(null);
  //     const responseObj = JSON.parse(xmlHttp.responseText);
  //     setLocationObj(responseObj);
  //   }

  //   function error() {
  //     toast.error('Error fetching current location!');
  //   }

  //   navigator.geolocation.getCurrentPosition(success, error, options);
  // };

  // useEffect(() => {
  //   getLocation();
  // }, []);

  const getDishCountFromCart = async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(
        `customers/${decoded.id}/cart-quantity`,
        {
          headers: { Authorization: token },
        },
      );
      setTotalDishesInCart(response.data.totalDishesInCart);
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
        setAddressToSend(response.data.existingAddresses[0].city);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveCustomerAddress = async () => {
    if (inputCustomerAddress.length === 0 && inputCustomerCity.length === 0) {
      setModalIsOpen(false);
      return;
    }
    if (inputCustomerAddress.length > 0 && inputCustomerCity.length === 0) {
      toast.error('Please enter city!');
      return;
    }
    if (inputCustomerCity.length > 0 && inputCustomerAddress.length === 0) {
      toast.error('Please enter address!');
      return;
    }
    try {
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);
      await axiosInstance.post(
        `customers/${decoded.id}/addresses`,
        {
          address: inputCustomerAddress,
          city: inputCustomerCity,
        },
        {
          headers: { Authorization: token },
        },
      );
      getCustomerAddresses();
      setInputCustomerAddress('');
      setInputCustomerCity('');
      toast.success('Address added!');
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
    getDishCountFromCart();
    getCustomerAddresses();
  }, [cart]);

  useEffect(() => {
    dispatch(setLocation(addressToSend));
  }, [addressToSend]);

  useEffect(() => {
    if (deliveryTypeselected === 0) {
      dispatch(setReduxDeliveryType('Delivery'));
    }
    if (deliveryTypeselected === 1) {
      dispatch(setReduxDeliveryType('Pickup'));
    }
  }, [deliveryTypeselected]);

  useEffect(() => {
    dispatch(setReduxSearchQuery(searchQuery));
  }, [searchQuery]);

  const customerSignOut = () => {
    dispatch(logoutCustomer());
    history.push('/');
  };

  return (
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
              id="city"
              autoComplete="off"
              placeholder="Enter city"
              value={inputCustomerCity}
              onChange={(e) => setInputCustomerCity(e.target.value)}
            />
          </FormControl>

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
              setAddressToSend('');
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
              <p style={{ fontWeight: 'bold' }}>All locations</p>
              <p style={{ marginTop: '-14px', fontSize: '14px' }}>
                Show restaurants
              </p>
            </Col>
          </div>

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
                      setAddressToSend(address.city);
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
                        {address ? address.address : 'All locations'}
                      </p>
                      <p style={{ marginTop: '-14px', fontSize: '14px' }}>
                        {address ? address.city : 'Deliver here'}
                      </p>
                    </Col>
                    <Button
                      style={{ marginRight: '10px' }}
                      onClick={(e) => {
                        deleteCustomerAddress(address._id);
                        e.stopPropagation();
                      }}
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

      <Cart setCartIsOpen={setCartIsOpen} cartIsOpen={cartIsOpen} />
      <Drawer
        onClose={() => setIsOpen(false)}
        autoFocus
        style={{ width: '100%' }}
        anchor={ANCHOR.left}
        isOpen={isOpen}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            minHeight: 'calc(100vh - 100px)',
          }}
        >
          <div style={{ marginTop: '15px' }}>
            <div
              onClick={() => {
                history.push('/customer/account');
                setIsOpen(false);
              }}
            >
              <CustomerProfileMenu showViewAccount />
            </div>
            <Nav
              style={{ marginTop: '-30px', marginLeft: '5px' }}
              className="col-md-10 d-none d-md-block"
              onSelect={(selectedKey) => {
                history.push(selectedKey);
                setIsOpen(false);
              }}
            >
              <div style={{ marginTop: '15px' }}>
                <Nav.Item>
                  <Nav.Link eventKey="/customer/orders">
                    <i className="fa fa-bookmark" aria-hidden="true" />
                    Orders
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="/customer/favourites">
                    <i className="fa fa-heart" aria-hidden="true" />
                    Favourites
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="/customer/wallet">
                    <i className="fa fa-briefcase" aria-hidden="true" />
                    Wallet
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="/customer/help">
                    <i className="fa fa-info-circle" aria-hidden="true" />
                    Help
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="/customer/promotions">
                    <i className="fa fa-tag" aria-hidden="true" />
                    Promotions
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="/customer/eatspass"
                    style={{ color: 'green' }}
                  >
                    <i className="fa fa-ticket" aria-hidden="true" />
                    Eats Pass
                    <br />
                    <span
                      style={{
                        color: 'grey',
                        fontSize: '15px',
                        marginLeft: '38px',
                      }}
                    >
                      1 month free with subscription
                    </span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="/customer/invite">
                    <i className="fa fa-gift" aria-hidden="true" />
                    Invite friends
                    <br />
                    <span
                      style={{
                        color: 'grey',
                        fontSize: '15px',
                        marginLeft: '38px',
                      }}
                    >
                      You get $10 off
                    </span>
                  </Nav.Link>
                </Nav.Item>
              </div>
              <p
                style={{
                  color: 'grey',
                  fontSize: '18px',
                  marginLeft: '15px',
                  marginTop: '20px',
                }}
                className="hoverCursor"
                onClick={customerSignOut}
              >
                Sign out
              </p>
            </Nav>
          </div>
          <div style={{ marginTop: '150px' }}>
            <hr />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <UberEatsSquareSvg />
              <p style={{ marginLeft: '20px', fontSize: 'large' }}>
                There&apos;s more to love not in the app. ;)
              </p>
            </div>

            <div
              style={{
                marginLeft: '-1px',
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Button
                kind={KIND.secondary}
                shape={SHAPE.pill}
                size={SIZE.compact}
              >
                <a
                  href="https://apps.apple.com/us/app/uber-eats-food-delivery/id1058959277"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'black' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i
                      className="fa fa-apple"
                      aria-hidden="true"
                      style={{ marginBottom: '8px' }}
                    />
                    <p style={{ marginBottom: 0 }}>iPhone</p>
                  </div>
                </a>
              </Button>
              <Button
                kind={KIND.secondary}
                shape={SHAPE.pill}
                size={SIZE.compact}
                style={{ marginLeft: '20px' }}
              >
                <a
                  href="https://play.google.com/store/apps/details?id=com.ubercab.eats"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'black' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i
                      className="fa fa-apple"
                      aria-hidden="true"
                      style={{ marginBottom: '8px' }}
                    />
                    <p style={{ marginBottom: 0 }}>Android</p>
                  </div>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
      {/* Navbar below */}
      <HeaderNavigation>
        <StyledNavigationList $align={ALIGN.left}>
          <Row
            style={{
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '36vw',
              marginLeft: '25px',
            }}
          >
            <Row style={{ alignItems: 'center' }}>
              <ThemeProvider
                theme={createTheme(lightThemePrimitives, {
                  colors: { buttonMinimalHover: '#FFFFFF' },
                })}
              >
                <Button kind={KIND.minimal} onClick={() => setIsOpen(true)}>
                  <Menu size={25} />
                </Button>
              </ThemeProvider>
              <Block
                style={{ marginLeft: '20px' }}
                onClick={() => history.push('/customer/dashboard')}
              >
                <UberEatsSvg />
              </Block>
            </Row>
            <Row style={{ fontSize: 'medium', marginTop: '10px' }}>
              <div
                style={{
                  backgroundColor: '#EEEEEE',
                  borderRadius: '100px',
                  padding: '5px',
                  height: '60px',
                  boxSizing: 'border-box',
                }}
              >
                <ButtonGroup
                  mode={MODE.radio}
                  shape={SHAPE.pill}
                  selected={deliveryTypeselected}
                  onClick={(event, index) => {
                    setDeliveryTypeselected(index);
                  }}
                >
                  <Button
                    style={
                      deliveryTypeselected === 0
                        ? { backgroundColor: 'white', color: 'black' }
                        : {}
                    }
                  >
                    Delivery
                  </Button>
                  <Button
                    style={
                      deliveryTypeselected === 1
                        ? { backgroundColor: 'white', color: 'black' }
                        : {}
                    }
                  >
                    Pickup
                  </Button>
                </ButtonGroup>
              </div>
              <Button
                $style={{
                  borderRadius: '100px',
                  marginLeft: '10px',
                  height: '60px',
                }}
                kind={KIND.secondary}
                onClick={() => setModalIsOpen(true)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <i
                    className="fa fa-map-marker"
                    aria-hidden="true"
                    style={{ marginBottom: '9px' }}
                  />
                  <p style={{ marginBottom: 0 }}>
                    {addressToSend || 'All locations'}
                  </p>
                </div>
              </Button>
            </Row>
          </Row>
        </StyledNavigationList>

        <StyledNavigationList $align={ALIGN.left}>
          <StyledNavigationItem style={{ width: '56vw', marginTop: '7px' }}>
            <Input
              placeholder="What are you craving?"
              type={TYPE.search}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </StyledNavigationItem>
        </StyledNavigationList>

        <StyledNavigationList
          $align={ALIGN.right}
          style={{ marginTop: '20px' }}
        >
          <p>
            <Button
              onClick={() => setCartIsOpen(true)}
              shape={SHAPE.pill}
              size={SIZE.mini}
            >
              <i
                className="fa fa-shopping-cart fa-lg"
                aria-hidden="true"
                style={{
                  marginTop: '5px',
                  marginBottom: '5px',
                  marginRight: '9px',
                }}
              />{' '}
              <div
                style={{
                  marginTop: '5px',
                  marginBottom: '5px',
                  marginLeft: '15px',
                }}
              >
                {totalDishesInCart}
              </div>
            </Button>
          </p>
        </StyledNavigationList>
      </HeaderNavigation>
    </>
  );
}
