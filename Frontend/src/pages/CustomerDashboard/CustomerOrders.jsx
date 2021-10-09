/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-one-expression-per-line */
import { Block } from 'baseui/block';
import {
  ALIGN,
  HeaderNavigation,
  StyledNavigationList,
} from 'baseui/header-navigation';
import { Display3, H6 } from 'baseui/typography';
import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { Button, SIZE } from 'baseui/button';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import toast from 'react-hot-toast';
import _ from 'underscore';

import axiosInstance from '../../services/apiConfig';

import UberEatsSvg from '../../components/UberEatsSvg';

import '../../css/CustomerOrder.css';

function CustomerOrders() {
  const history = useHistory();
  const [orderDishCounts, setOrderDishCounts] = useState([]);
  const [orderRestImages, setOrderRestImages] = useState([]);

  const getCustomerOrders = async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(
        `customers/${decoded.id}/orders`,
        {
          headers: { Authorization: token },
        },
      );
      const uniqueRestImages = await _.uniq(
        response.data.orderDetails,
        (x) => x.orderId,
      );
      setOrderRestImages(uniqueRestImages);
      const orderDishCountsObj = {};
      response.data.orderDishCounts.forEach((element) => {
        orderDishCountsObj[element.orderId] = element.totalDishCount;
      });
      setOrderDishCounts(orderDishCountsObj);
    } catch (error) {
      // eslint-disable-next-line no-prototype-builtins
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/customer');
          return;
        }
        toast.error(error.response.data.error);
      }
    }
  };

  console.log(orderRestImages);
  console.log(orderDishCounts);

  useEffect(() => {
    getCustomerOrders();
  }, []);

  return (
    <div>
      <HeaderNavigation>
        <StyledNavigationList $align={ALIGN.left}>
          <div
            style={{
              alignItems: 'flex-start',
              width: '100vw',
            }}
          >
            <div style={{ alignItems: 'flex-start', display: 'flex' }}>
              <Block
                style={{ marginLeft: '20px' }}
                onClick={() => history.push('/customer/dashboard')}
              >
                <UberEatsSvg />
              </Block>
            </div>
          </div>
        </StyledNavigationList>
      </HeaderNavigation>
      <div style={{ marginLeft: '50px', marginTop: '10px' }}>
        <Display3>Past Orders</Display3>

        {orderRestImages
          ? orderRestImages.length > 0
            ? orderRestImages.map((orderRestImage) => (
                <>
                  <div
                    style={{
                      display: 'flex',
                      marginLeft: '-27px',
                      marginTop: '20px',
                    }}
                  >
                    <Col>
                      <img
                        className="col-sm-12"
                        src={orderRestImage.imageLink}
                        alt="sans"
                      />
                    </Col>
                    <Col xs={7}>
                      <H6>{orderRestImage.name}</H6>
                      <p>
                        {orderDishCounts[orderRestImage.orderId]} item for $
                        {orderRestImage.totalPrice} &middot;{' '}
                        {new Date(orderRestImage.orderPlacedTime).toUTCString()}{' '}
                        &middot;{' '}
                        <span
                          className="hoverUnderline"
                          style={{ fontWeight: 'bold' }}
                        >
                          View receipt
                        </span>
                      </p>
                    </Col>
                    <Col style={{ marginRight: '45px' }}>
                      <div style={{ justifyContent: 'center' }}>
                        <Button
                          size={SIZE.large}
                          onClick={() => history.push(
                              `/customer/restaurants${orderRestImage.restId}`,
                            )}
                          $style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ justifyContent: 'center' }}>
                            View store
                          </span>
                        </Button>
                      </div>
                    </Col>
                  </div>
                  <hr />
                </>
              ))
            : null
          : null}
      </div>
    </div>
  );
}

export default CustomerOrders;
