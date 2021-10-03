/* eslint-disable no-prototype-builtins */
/* eslint-disable camelcase */
import React from 'react';
import { Nav } from 'react-bootstrap';
import { useHistory, withRouter } from 'react-router';
import { useDispatch } from 'react-redux';
// import { Avatar } from 'baseui/avatar';

import '../css/Sidebar.css';
import UberEatsSvg from './UberEatsSvg';
import { logoutRestaurant } from '../actions/restaurant';
import RestaurantProfileMenu from './RestaurantProfileMenu';

const { ButtonContainer, ButtonRow, ButtonMod } = require('./Button');

const Side = () => {
  const history = useHistory();
  const dispatch = useDispatch();

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
      <ButtonContainer>
        <ButtonRow>
          <ButtonMod
            type="submit"
            style={{
              width: '80%',
              justifyContent: 'center',
              marginLeft: '20px',
              marginTop: '20px',
            }}
            onClick={() => {
              dispatch(logoutRestaurant());
              history.push('/');
            }}
          >
            Logout
          </ButtonMod>
        </ButtonRow>
      </ButtonContainer>
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <RestaurantProfileMenu />
      </div>
    </Nav>
  );
};
const Sidebar = withRouter(Side);
export default Sidebar;
