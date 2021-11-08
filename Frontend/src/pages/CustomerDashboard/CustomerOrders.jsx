/* eslint-disable operator-linebreak */
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
import { Block } from 'baseui/block';
import {
  ALIGN,
  HeaderNavigation,
  StyledNavigationList,
} from 'baseui/header-navigation';
// eslint-disable-next-line object-curly-newline
import { Display4, H4, H6, Label1, LabelMedium } from 'baseui/typography';
import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { Button, SIZE } from 'baseui/button';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
// import _ from 'underscore';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  // ModalButton,
} from 'baseui/modal';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';
import { ThemeProvider, createTheme, lightThemePrimitives } from 'baseui';
import toast from 'react-hot-toast';
import { Pagination } from 'baseui/pagination';

import axiosInstance from '../../services/apiConfig';

import UberEatsSvg from '../../components/UberEatsSvg';
import restaurantDefaultImage from '../../assets/img/rest-default.jpg';

import '../../css/CustomerOrder.css';

function CustomerOrders() {
  const history = useHistory();
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState([
    { orderStatusFilter: 'Show all orders' },
  ]);
  const [pageSize, setPageSize] = useState([{ pageSize: 5 }]);
  const [paginationFilter, setPaginationFilter] = useState({});
  const [currentPage, setCurrentPage] = React.useState(1);

  const getFilteredOrders = async () => {
    let selectedOrderStatus = orderStatusFilter[0].orderStatusFilter;
    if (selectedOrderStatus === 'Show all orders') {
      selectedOrderStatus = null;
    }
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(
        `customers/${decoded.id}/orders`,
        {
          headers: { Authorization: token },
          params: {
            page: currentPage,
            limit: pageSize[0].pageSize,
            orderStatus: selectedOrderStatus,
          },
        },
      );
      setPaginationFilter({
        currentPage: response.data.currentPage,
        totalDocuments: response.data.totalDocuments,
        totalPages: response.data.totalPages,
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrderDetails = async (orderId) => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(
        `customers/${decoded.id}/orders/${orderId}`,
        {
          headers: { Authorization: token },
        },
      );
      setOrderDetails(response.data.orderDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const cancelOrder = async (orderId) => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.put(
        `customers/${decoded.id}/orders/${orderId}`,
        {},
        {
          headers: { Authorization: token },
        },
      );
      toast.success(response.data.message);
      getFilteredOrders();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFilteredOrders();
  }, [pageSize, currentPage, orderStatusFilter]);

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
          {orderDetails
            ? orderDetails.dishes.length > 0
              ? orderDetails.dishes.map((dish) => (
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
              {orderDetails ? orderDetails.orderStatus : ''}
            </LabelMedium>
          </div>

          {orderDetails ? (
            orderDetails.orderStatus ===
            'Cancelled' ? null : orderDetails.orderType === 'Delivery' ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '10px',
                }}
              >
                {orderDetails ? (
                  orderDetails.orderStatus === 'Delivered' ? (
                    <LabelMedium>Delivered to</LabelMedium>
                  ) : (
                    <LabelMedium>Will be delivered to</LabelMedium>
                  )
                ) : null}
                <LabelMedium style={{ fontWeight: 'normal' }}>
                  {orderDetails ? orderDetails.orderAddress : ''}
                </LabelMedium>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '10px',
                }}
              >
                <LabelMedium>Pickup from</LabelMedium>
                <LabelMedium style={{ fontWeight: 'normal' }}>
                  {orderDetails
                    ? `${orderDetails.restId?.name}, ${orderDetails.restId?.address}`
                    : ''}
                </LabelMedium>
              </div>
            )
          ) : null}

          {orderDetails ? (
            orderDetails.notes ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '10px',
                }}
              >
                <LabelMedium>Notes</LabelMedium>
                <LabelMedium style={{ fontWeight: 'normal' }}>
                  {orderDetails ? orderDetails.notes : ''}
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
      </Modal>
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
        <Display4>Past Orders</Display4>

        <div
          style={{
            padding: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
            marginLeft: '-25px',
            marginRight: '20px',
          }}
        >
          <Col>
            <FormControl label="Filter by order status">
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
                onChange={async ({ value }) => {
                  setOrderStatusFilter(value);
                }}
              />
            </FormControl>
          </Col>
          <Col>
            <FormControl label="Select page size">
              <Select
                clearable={false}
                escapeClearsValue={false}
                options={[{ pageSize: 2 }, { pageSize: 5 }, { pageSize: 10 }]}
                valueKey="pageSize"
                labelKey="pageSize"
                placeholder="Select page size"
                value={pageSize}
                onChange={({ value }) => {
                  setPageSize(value);
                  setCurrentPage(1);
                  getFilteredOrders();
                }}
              />
            </FormControl>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Pagination
                numPages={paginationFilter.totalPages}
                currentPage={currentPage}
                onPageChange={({ nextPage }) => {
                  setCurrentPage(Math.min(Math.max(nextPage, 1), 20));
                }}
              />
            </div>
          </Col>
        </div>

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
                        order.restId.restImages
                          ? order.restId.restImages.length > 0
                            ? order.restId.restImages[0].imageLink
                            : restaurantDefaultImage
                          : restaurantDefaultImage
                      }
                      alt="sans"
                    />
                  </Col>
                  <Col xs={7}>
                    <H6>{order.restId.name}</H6>
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
                        View receipt
                      </span>
                    </p>
                  </Col>
                  <Col
                    style={{
                      marginRight: '45px',
                    }}
                  >
                    <Button
                      size={SIZE.large}
                      onClick={() =>
                        history.push(
                          `/customer/restaurants/${order.restId._id}`,
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

                    {order.orderStatus === 'Initialized' ||
                    order.orderStatus === 'Placed' ? (
                      <ThemeProvider
                        theme={createTheme(lightThemePrimitives, {
                          colors: { buttonPrimaryFill: '#E73E33' },
                        })}
                      >
                        <Button
                          onClick={() => cancelOrder(order._id)}
                          $style={{ width: '100%', marginTop: '20px' }}
                        >
                          Cancel order
                        </Button>
                      </ThemeProvider>
                    ) : null}
                  </Col>
                </div>
                <hr />
              </>
            ))
          ) : (
            <p style={{ textAlign: 'center' }}>No such orders</p>
          )
        ) : null}
      </div>
    </div>
  );
}

export default CustomerOrders;
