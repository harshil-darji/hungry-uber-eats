/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-one-expression-per-line */
// eslint-disable-next-line object-curly-newline
import { H6 } from 'baseui/typography';
import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { Button, SIZE } from 'baseui/button';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import toast from 'react-hot-toast';
import _ from 'underscore';
import // Modal,
// ModalHeader,
// ModalBody,
// ModalFooter,
// ModalButton,
'baseui/modal';

import axiosInstance from '../../services/apiConfig';

function RestaurantOrders() {
  const history = useHistory();

  const [orderDishCounts, setOrderDishCounts] = useState([]);
  const [orderRestImages, setOrderRestImages] = useState([]);
  // const [orderDetails, setOrderDetails] = useState(null);
  // const [modalIsOpen, setModalIsOpen] = useState(false);

  const getRestaurantOrders = async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(
        `restaurants/${decoded.id}/orders`,
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

  useEffect(() => {
    getRestaurantOrders();
  }, []);

  return (
    <div>
      {/* <Modal
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
          <H6 style={{ fontWeight: 'normal', textAlign: 'center' }}>Receipt</H6>
        </ModalHeader>
        <ModalBody>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <H4>Total</H4>
            <H4>
              {orderDetails ? (
                <>
                  $
                  {' '}
                  {orderDetails[0].totalPrice}
                  {' '}
                </>
              ) : ''}
            </H4>
          </div>
          {orderDetails
            ? orderDetails.length > 0
              ? orderDetails.map((orderDetail) => (
                <div
                  style={{
                    marginRight: '10px',
                    marginLeft: '10px',
                    marginTop: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <div
                        className="smallBox"
                        style={{ textAlign: 'center' }}
                      >
                        {orderDetail.dishCount}
                      </div>
                      <Label1 style={{ marginLeft: '10px' }}>
                        {orderDetail.name}
                      </Label1>
                    </div>
                    <Label1>
                      $
                      {orderDetail.dishPrice}
                    </Label1>
                  </div>

                  <p
                    style={{
                      marginLeft: '35px',
                      marginTop: '10px',
                      fontSize: '16px',
                    }}
                  >
                    {orderDetail.name}
                    {' '}
                    comes with
                    {' '}
                  </p>
                  <p style={{ marginLeft: '35px' }}>{orderDetail.ingreds}</p>
                </div>
              ))
              : null
            : null}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <LabelMedium>Order status</LabelMedium>
            <LabelMedium style={{ fontWeight: 'normal' }}>
              {orderDetails ? orderDetails[0].orderStatus : ''}
            </LabelMedium>
          </div>
          {orderDetails ? (
            orderDetails[0].orderType === 'Delivery' ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '10px',
                }}
              >
                <LabelMedium>Delivered to</LabelMedium>
                <LabelMedium style={{ fontWeight: 'normal' }}>
                  {orderDetails ? orderDetails[0].orderAddress : ''}
                </LabelMedium>
              </div>
            ) : null
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button
            $style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
            onClick={() => setModalIsOpen(false)}
          >
            <span style={{ justifyContent: 'center' }}>Close</span>
          </Button>
        </ModalFooter>
      </Modal> */}
      <div style={{ marginLeft: '30px', marginTop: '30px' }}>

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
                        src={orderRestImage.profileImg}
                        alt="sans"
                      />
                    </Col>
                    <Col xs={7}>
                      <H6>{orderRestImage.name}</H6>
                      <p>
                        {orderDishCounts[orderRestImage.orderId]} items for $
                        {orderRestImage.totalPrice} &middot;{' '}
                        {new Date(orderRestImage.orderPlacedTime).toUTCString()}{' '}
                        &middot;{' '}
                        <span
                          className="hoverUnderline"
                          style={{ fontWeight: 'bold' }}
                          onClick={async () => {
                            // await getOrderDetails(orderRestImage.orderId);
                            // setModalIsOpen(true);
                          }}
                        >
                          View receipt
                        </span>
                      </p>
                    </Col>
                    <Col style={{ marginRight: '45px' }}>
                      <div style={{ justifyContent: 'center' }}>
                        <Button
                          size={SIZE.large}
                          onClick={() =>
                            history.push(
                              `/customer/restaurants${orderRestImage.restId}`,
                            )
                          }
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

export default RestaurantOrders;
