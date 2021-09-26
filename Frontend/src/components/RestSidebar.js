/* eslint-disable react/button-has-type */
import React from 'react';
import { Nav } from 'react-bootstrap';
import { useHistory, withRouter } from 'react-router';
import { Avatar } from 'baseui/avatar';
import ChevronDown from 'baseui/icon/chevron-down';
import '../css/Sidebar.css';
import UberEatsSvg from './UberEatsSvg';

const Side = () => {
  const history = useHistory();

  return (
    <>
      <div className="border-end bg-white" id="sidebar-wrapper">
        <Nav
          className="col-md-2 d-none d-md-block sidebar"
          activeKey="/home"
          onSelect={(selectedKey) => history.push(selectedKey)}
        >
          <div className="sidebar-sticky">
            <Nav.Item>
              <Nav.Link eventKey="/restaurant/dashboard">
                <UberEatsSvg />
              </Nav.Link>
            </Nav.Item>
            <div style={{ marginTop: '15px' }}>
              <Nav.Item>
                <Nav.Link href="/restaurant/dashboard">
                  <i
                    className="fa fa-home"
                    style={{ fontSize: '1.5em' }}
                    aria-hidden="true"
                  />
                  Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/restaurant/menu">
                  <i
                    className="fa fa-cutlery"
                    style={{ fontSize: '1.5em' }}
                    aria-hidden="true"
                  />
                  Menu
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/restaurant/menu">
                  <i
                    className="fa fa-cog"
                    style={{ fontSize: '1.5em' }}
                    aria-hidden="true"
                  />
                  Settings
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/restaurant/menu">
                  <i
                    className="fa fa-question-circle"
                    style={{ fontSize: '1.5em' }}
                    aria-hidden="true"
                  />
                  Help
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
            <Avatar
              name="user"
              size="scale1400"
              src="https://avatars.dicebear.com/api/human/1.svg?width=285&mood=happy"
              key="1"
            />
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
                <div style={{ fontWeight: 'bolder' }}>Restaurant name</div>
                <ChevronDown size={30} />
              </div>
              <div style={{ color: 'grey', marginLeft: '5px' }}>
                Restaurant address
              </div>
            </div>
          </div>
        </Nav>
      </div>
    </>
  );
};
const Sidebar = withRouter(Side);
export default Sidebar;
