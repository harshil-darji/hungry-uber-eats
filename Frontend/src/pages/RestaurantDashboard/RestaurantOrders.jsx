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
import { H4, H6, Label1, LabelMedium } from 'baseui/typography';
import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { Button, SIZE } from 'baseui/button';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import toast from 'react-hot-toast';
import _ from 'underscore';
import {
  Modal,
  ModalHeader,
  ModalBody,
  // ModalFooter,
  // ModalButton,
} from 'baseui/modal';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';

import axiosInstance from '../../services/apiConfig';
import customerDefaultImage from '../../assets/img/customer-default-profile.jpeg';

function RestaurantOrders() {
  const history = useHistory();

  const [orderDishCounts, setOrderDishCounts] = useState([]);
  const [orderRestImages, setOrderRestImages] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  console.log(orderRestImages);

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
          history.push('/login/restaurant');
          return;
        }
        toast.error(error.response.data.error);
      }
    }
  };

  const getOrderDetails = async (orderId) => {
    // eslint-disable-next-line no-unreachable
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(
        `restaurants/${decoded.id}/orders/${orderId}`,
        {
          headers: { Authorization: token },
        },
      );
      console.log(response.data);
      setOrderDetails(response.data.orderDetails);
    } catch (error) {
      // eslint-disable-next-line no-prototype-builtins
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/restaurant');
          return;
        }
        toast.error(error.response.data.error);
      }
    }
  };

  const updateOrderStatus = async (status, orderId) => {
    try {
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);
      const updatedOrderStatus = status[0].orderStatus;
      // eslint-disable-next-line no-unreachable
      await axiosInstance.put(
        `restaurants/${decoded.id}/orders/${orderId}`,
        {
          orderStatus: updatedOrderStatus,
        },
        {
          headers: { Authorization: token },
        },
      );
      getRestaurantOrders();
      toast.success('Order status updated!');
    } catch (error) {
      // eslint-disable-next-line no-prototype-builtins
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/restaurant');
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
            <H4>{orderDetails ? <>$ {orderDetails[0].totalPrice} </> : ''}</H4>
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
                      <Label1>${orderDetail.dishPrice}</Label1>
                    </div>

                    <p
                      style={{
                        marginLeft: '35px',
                        marginTop: '10px',
                        fontSize: '16px',
                      }}
                    >
                      {orderDetail.name} comes with{' '}
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
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '30px',
            marginTop: '20px',
          }}
        >
          <Button
            $style={{
              width: '90%',
              display: 'flex',
              justifyContent: 'center',
            }}
            onClick={() => setModalIsOpen(false)}
          >
            <span style={{ justifyContent: 'center' }}>Close</span>
          </Button>
        </div>
      </Modal>
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
                        src={
                          orderRestImage.profileImg
                            ? orderRestImage.profileImg
                            : customerDefaultImage
                        }
                        alt="Customer profile"
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
                            await getOrderDetails(orderRestImage.orderId);
                            setModalIsOpen(true);
                          }}
                        >
                          View order details
                        </span>
                      </p>

                      <LabelMedium>
                        Order status: {orderRestImage.orderStatus}
                      </LabelMedium>

                      <div style={{ marginTop: '8px' }} />
                      <LabelMedium>
                        Order type: {orderRestImage.orderType}
                      </LabelMedium>

                      <div style={{ marginTop: '20px', width: '510px' }}>
                        <FormControl>
                          {orderRestImage.orderStatus === 'Delivery' ? (
                            <Select
                              options={[
                                { orderStatus: 'Preparing' },
                                { orderStatus: 'On the Way' },
                                { orderStatus: 'Delivered' },
                              ]}
                              valueKey="orderStatus"
                              labelKey="orderStatus"
                              placeholder="Update order status"
                              value={[
                                { orderStatus: orderRestImage.orderStatus },
                              ]}
                              onChange={({ value }) => {
                                updateOrderStatus(
                                  value,
                                  orderRestImage.orderId,
                                );
                              }}
                            />
                          ) : (
                            <Select
                              options={[
                                { orderStatus: 'Preparing' },
                                { orderStatus: 'Ready' },
                                { orderStatus: 'Picked Up' },
                              ]}
                              valueKey="orderStatus"
                              labelKey="orderStatus"
                              placeholder="Update order status"
                              value={[
                                { orderStatus: orderRestImage.orderStatus },
                              ]}
                              onChange={({ value }) => {
                                updateOrderStatus(
                                  value,
                                  orderRestImage.orderId,
                                );
                              }}
                            />
                          )}
                        </FormControl>
                      </div>
                    </Col>
                    <Col style={{ marginRight: '45px' }}>
                      <div style={{ justifyContent: 'center' }}>
                        <Button
                          size={SIZE.large}
                          onClick={() =>
                            history.push(
                              `/restaurant/customer/${orderRestImage.custId}`,
                            )
                          }
                          $style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ justifyContent: 'center' }}>
                            View customer
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
