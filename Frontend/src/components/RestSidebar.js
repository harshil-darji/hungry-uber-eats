/* eslint-disable no-prototype-builtins */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Nav } from 'react-bootstrap';
import { useHistory, withRouter } from 'react-router';
import { Avatar } from 'baseui/avatar';
import jwt_decode from 'jwt-decode';
import toast from 'react-hot-toast';

import axiosInstance from '../services/apiConfig';

import '../css/Sidebar.css';
import UberEatsSvg from './UberEatsSvg';

const Side = () => {
  const history = useHistory();
  const restaurant = useSelector((state) => state.restaurant);

  const [name, setname] = useState('');
  const [address, setAddress] = useState('');
  const [restImages, setRestImages] = useState(null);

  const fetchRestaurantData = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(`/restaurants/${decoded.id}`, {
        headers: { Authorization: token },
      });
      setname(response.data.rest.name);
      setAddress(response.data.rest.address ? response.data.rest.address : '');
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/restaurant');
        }
      }
    }
  }, []);

  const getRestaurantImages = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);
      const response = await axiosInstance.get(
        `restaurants/${decoded.id}/images`,
        {
          headers: { Authorization: token },
        },
      );
      setRestImages(response.data.restImages);
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          // history.push('/login/restaurant');
        }
        toast.error(error.response.data.error);
      }
    }
  };

  useEffect(() => {
    getRestaurantImages();
    fetchRestaurantData();
  }, [restaurant]);

  return (
    <Nav
      className="col-md-2 d-none d-md-block sidebar"
      // activeKey={active}
      onSelect={(selectedKey) => history.push(selectedKey)}
    >
      <div className="sidebar-sticky">
        <Nav.Item>
          <Nav.Link
            style={{ display: 'flex', justifyContent: 'center' }}
            eventKey="/restaurant/dashboard"
          >
            <UberEatsSvg />
          </Nav.Link>
        </Nav.Item>
        <div style={{ marginTop: '15px' }}>
          <Nav.Item>
            <Nav.Link eventKey="/restaurant/dashboard">
              <i
                className="fa fa-home"
                style={{ fontSize: '1.5em' }}
                aria-hidden="true"
              />
              Home
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/restaurant/menu">
              <i
                className="fa fa-cutlery"
                style={{ fontSize: '1.5em' }}
                aria-hidden="true"
              />
              Menu
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/restaurant/settings">
              <i
                className="fa fa-cog"
                style={{ fontSize: '1.5em' }}
                aria-hidden="true"
              />
              Settings
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/restaurant/orders">
              <i
                className="fa fa-shopping-cart"
                style={{ fontSize: '1.5em' }}
                aria-hidden="true"
              />
              Orders
            </Nav.Link>
          </Nav.Item>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {restImages ? (
          <Avatar name="user" size="scale1400" src={restImages[0].imageLink} key="1" />
        ) : (
          <Avatar
            name="user"
            size="scale1400"
            src="https://avatars.dicebear.com/api/human/1.svg?width=285&mood=happy"
            key="1"
          />
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            className="row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginLeft: '5px',
            }}
          >
            <div style={{ fontWeight: 'bolder' }}>{name}</div>
          </div>
          <div style={{ color: 'grey', marginLeft: '5px' }}>{address}</div>
        </div>
      </div>
    </Nav>
  );
};
const Sidebar = withRouter(Side);
export default Sidebar;
