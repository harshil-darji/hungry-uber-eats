/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-no-bind */
// eslint-disable-next-line object-curly-newline
import React, { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import Menu from 'baseui/icon/menu';
import toast from 'react-hot-toast';
import { Block } from 'baseui/block';
import { ButtonGroup, SHAPE, MODE } from 'baseui/button-group';
import { Button, KIND, SIZE } from 'baseui/button';
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationList,
  StyledNavigationItem,
} from 'baseui/header-navigation';
import { StatefulSelect as Search, TYPE } from 'baseui/select';

import UberEatsSvg from '../../components/UberEatsSvg';

export default function CustomerNavbar() {
  const [deliveryTypeselected, setDeliveryTypeselected] = useState(0);
  const [locationObj, setLocationObj] = useState(null);
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
      console.log(responseObj);
      setLocationObj(responseObj);
    }

    function error() {
      toast.error('Error fetching current location!');
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  };

  // const fetchCustomerData = useCallback(async () => {
  //   const token = sessionStorage.getItem('token');
  //   const decoded = jwt_decode(token);
  //   try {
  //     const response = await axiosInstance.get(`customers/${decoded.id}`, {
  //       headers: { Authorization: token },
  //     });
  //     setUserDetails(response.data.user);
  //   } catch (error) {
  //     if (error.hasOwnProperty('response')) {
  //       if (error.response.status === 403) {
  //         toast.error('Session expired. Please login again!');
  //         history.push('/login/customer');
  //       }
  //     }
  //   }
  // }, []);

  useEffect(() => {
    // fetchCustomerData();
    getLocation();
  }, []);

  return (
    <>
      <HeaderNavigation>
        <StyledNavigationList $align={ALIGN.left}>
          <Row
            style={{
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '35vw',
              marginLeft: '30px',
            }}
          >
            <Row style={{ alignItems: 'center' }}>
              <Menu size={25} />
              <Block style={{ marginLeft: '20px' }}>
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
                style={{
                  borderRadius: '100px',
                  marginLeft: '10px',
                }}
                kind={KIND.secondary}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <i
                    className="fa fa-map-marker"
                    aria-hidden="true"
                    style={{ marginBottom: '9px' }}
                  />
                  <p style={{ marginBottom: 0 }}>
                    {locationObj?.address.residential
                      ? locationObj.address.residential
                      : 'Enter address'}
                  </p>
                </div>
              </Button>
            </Row>
          </Row>
        </StyledNavigationList>

        <StyledNavigationList $align={ALIGN.left}>
          <StyledNavigationItem style={{ width: '56vw', marginTop: '7px' }}>
            <Search
              placeholder="What are you craving?"
              type={TYPE.search}
              getOptionLabel={(props) => props.option.id || null}
              onChange={() => {}}
            />
          </StyledNavigationItem>
        </StyledNavigationList>

        <StyledNavigationList
          $align={ALIGN.right}
          style={{ marginTop: '20px' }}
        >
          <p>
            <Button shape={SHAPE.pill} size={SIZE.mini}>
              <i
                className="fa fa-shopping-cart fa-lg"
                aria-hidden="true"
                style={{
                  marginTop: '5px',
                  marginBottom: '5px',
                  marginRight: '9px',
                }}
              />
              {' '}
              <div
                style={{
                  marginTop: '5px',
                  marginBottom: '5px',
                  marginLeft: '1px',
                }}
              >
                0
              </div>
            </Button>
          </p>
        </StyledNavigationList>
      </HeaderNavigation>
    </>
  );
}
