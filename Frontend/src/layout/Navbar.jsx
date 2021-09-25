import React from 'react';
// import { Button } from 'react-bootstrap';
import '../css/Navbar.css';
import { Button, SHAPE } from 'baseui/button';
import { useHistory } from 'react-router-dom';

import UberEatsSvg from '../components/UberEatsSvg.jsx';

function Navbar() {
  const history = useHistory();
  return (
    <div className="nav navbar fixed-top">
      <div>
        {/* <i className="fa fa-bars menuIcon" aria-hidden="true" /> */}
        <UberEatsSvg />
      </div>
      <Button
        className="navButton"
        onClick={() => history.push('/login')}
        shape={SHAPE.pill}
      >
        Sign in
      </Button>
    </div>
  );
}

export default Navbar;
