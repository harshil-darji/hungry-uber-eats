/* eslint-disable */
import React from 'react';
// import { Button } from 'react-bootstrap';
import '../css/Navbar.css';
import { Button, SHAPE, SIZE } from 'baseui/button';
import Menu from 'baseui/icon/menu';
import { useHistory } from 'react-router-dom';
import { Drawer, ANCHOR } from 'baseui/drawer';

import UberEatsSvg from '../components/UberEatsSvg.jsx';

function Navbar() {
  const history = useHistory();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Drawer
        onClose={() => setIsOpen(false)}
        autoFocus
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
          <div style={{ padding: '24px' }}>
            <Button
              style={{ width: '100%' }}
              onClick={() => history.push('/login/customer')}
              size={SIZE.large}
            >
              Sign in
            </Button>
            <h6
              className="h6Link"
              onClick={() => history.push('/register/restaurant')}
            >
              Add your restaurant
            </h6>
            <h6
              className="h6Link"
              onClick={() => history.push('/login/restaurant')}
            >
              Login to your restaurant
            </h6>
          </div>

          <div>hola!</div>
        </div>
      </Drawer>
      <div className="nav navbar fixed-top">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!isOpen && (
            <>
              <button
                onClick={() => setIsOpen(true)}
                className="transparentButton"
              >
                <Menu size={32} />
              </button>
              <span style={{ marginLeft: '20px' }}>
                <UberEatsSvg />
              </span>
            </>
          )}
        </div>
        <Button
          className="navButton"
          onClick={() => history.push('/login/customer')}
          shape={SHAPE.pill}
        >
          Sign in
        </Button>
      </div>
    </>
  );
}

export default Navbar;
