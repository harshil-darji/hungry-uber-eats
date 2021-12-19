/* eslint-disable no-underscore-dangle */
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
import {
  Modal,
  ModalHeader,
  ModalBody,
  // ModalFooter,
  // ModalButton,
} from 'baseui/modal';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';
import { Skeleton } from 'baseui/skeleton';

import axiosInstance from '../../services/apiConfig';
import customerDefaultImage from '../../assets/img/customer-default-profile.jpeg';

function RestaurantOrders() {
  const history = useHistory();

  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState([
    { orderStatusFilter: 'Show all orders' },
  ]);

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
      setOrders(response.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const getFilteredOrders = async (orderStatus) => {
    const selectedOrderStatus = orderStatus[0].orderStatusFilter;
    if (selectedOrderStatus === 'Show all orders') {
      getRestaurantOrders();
      return;
    }
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(
        `restaurants/${decoded.id}/orders/search/${selectedOrderStatus}`,
        {
          headers: { Authorization: token },
        },
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.log(error);
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
      setOrderDetails(response.data.orderDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const updateOrderStatus = async (status, orderId) => {
    try {
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);
      const updatedOrderStatus = status[0].orderStatus;
      // eslint-disable-next-line no-unreachable
      const res = await axiosInstance.put(
        `restaurants/${decoded.id}/orders/${orderId}`,
        {
          orderStatus: updatedOrderStatus,
        },
        {
          headers: { Authorization: token },
        },
      );
      console.log(res);
      getRestaurantOrders();
      toast.success('Order status updated!');
    } catch (error) {
      console.log(error);
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
            <H4>
              {orderDetails ? <>$ {orderDetails.totalOrderPrice} </> : ''}
            </H4>
          </div>
          {orderDetails ? (
            orderDetails.dishes.length > 0 ? (
              orderDetails.dishes.map((dish) => (
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
                      <div className="smallBox" style={{ textAlign: 'center' }}>
                        {dish.dishDetails.dishQuantity}
                      </div>
                      <Label1 style={{ marginLeft: '10px' }}>
                        {dish.dishDetails.name}
                      </Label1>
                    </div>
                    <Label1>${dish.dishDetails.dishPrice}</Label1>
                  </div>

                  <p
                    style={{
                      marginLeft: '35px',
                      marginTop: '10px',
                      fontSize: '16px',
                    }}
                  >
                    {dish.dishDetails.name} comes with{' '}
                  </p>
                  <p style={{ marginLeft: '35px' }}>
                    {dish.dishDetails.ingreds.length > 0
                      ? dish.dishDetails.ingreds.slice(0, -1)
                      : ''}
                  </p>
                </div>
              ))
            ) : (
              <h6>No such orders</h6>
            )
          ) : null}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <LabelMedium>Order status</LabelMedium>
            <LabelMedium style={{ fontWeight: 'normal' }}>
              {orderDetails ? orderDetails.orderStatus : ''}
            </LabelMedium>
          </div>
          {orderDetails ? (
            orderDetails.orderType === 'Delivery' ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '10px',
                }}
              >
                <LabelMedium>Delivered to</LabelMedium>
                <LabelMedium style={{ fontWeight: 'normal' }}>
                  {orderDetails ? orderDetails.orderAddress : ''}
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
      <div
        style={{
          padding: '30px',
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          marginTop: '20px',
        }}
      >
        <FormControl label="Filter orders">
          <Select
            clearable={false}
            escapeClearsValue={false}
            options={[
              { orderStatusFilter: 'Show all orders' },
              { orderStatusFilter: 'Placed' },
              { orderStatusFilter: 'Ready' },
              { orderStatusFilter: 'Preparing' },
              { orderStatusFilter: 'On the Way' },
              { orderStatusFilter: 'Delivered' },
              { orderStatusFilter: 'Picked up' },
              { orderStatusFilter: 'Cancelled' },
            ]}
            valueKey="orderStatusFilter"
            labelKey="orderStatusFilter"
            placeholder="Filter order"
            value={orderStatusFilter}
            onChange={({ value }) => {
              setOrderStatusFilter(value);
              getFilteredOrders(value);
            }}
          />
        </FormControl>
      </div>
      <div style={{ marginLeft: '30px', marginTop: '30px' }}>
        {orders ? (
          orders.length > 0 ? (
            orders.map((order) => (
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
                        order.custId.profileImg
                          ? order.custId.profileImg
                          : customerDefaultImage
                      }
                      alt="Customer profile"
                    />
                  </Col>
                  <Col xs={7}>
                    <H6>{order.custId.name}</H6>
                    <p>
                      {order.dishes.length} items for ${order.totalOrderPrice}{' '}
                      &middot; {new Date(order.orderPlacedTime).toUTCString()}{' '}
                      &middot;{' '}
                      <span
                        className="hoverUnderline"
                        style={{ fontWeight: 'bold' }}
                        onClick={async () => {
                          await getOrderDetails(order._id);
                          setModalIsOpen(true);
                        }}
                      >
                        View order details
                      </span>
                    </p>

                    <LabelMedium>Order status: {order.orderStatus}</LabelMedium>

                    <div style={{ marginTop: '8px' }} />
                    <LabelMedium>Order type: {order.orderType}</LabelMedium>

                    <div style={{ marginTop: '20px', width: '510px' }}>
                      <FormControl>
                        {order.orderType === 'Delivery' ? (
                          <Select
                            clearable={false}
                            escapeClearsValue={false}
                            options={[
                              { orderStatus: 'Preparing' },
                              { orderStatus: 'On the Way' },
                              { orderStatus: 'Delivered' },
                              { orderStatus: 'Cancelled' },
                            ]}
                            valueKey="orderStatus"
                            labelKey="orderStatus"
                            placeholder="Update order status"
                            value={[{ orderStatus: order.orderStatus }]}
                            onChange={({ value }) => {
                              updateOrderStatus(value, order._id);
                            }}
                          />
                        ) : (
                          <Select
                            clearable={false}
                            escapeClearsValue={false}
                            options={[
                              { orderStatus: 'Preparing' },
                              { orderStatus: 'Ready' },
                              { orderStatus: 'Picked Up' },
                              { orderStatus: 'Cancelled' },
                            ]}
                            valueKey="orderStatus"
                            labelKey="orderStatus"
                            placeholder="Update order status"
                            value={[{ orderStatus: order.orderStatus }]}
                            onChange={({ value }) => {
                              updateOrderStatus(value, order._id);
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
                            `/restaurant/customer/${order.custId._id}`,
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
          ) : null
        ) : (
          <Skeleton width="80%" height="90%" animation />
        )}
      </div>
    </div>
  );
}

export default RestaurantOrders;
