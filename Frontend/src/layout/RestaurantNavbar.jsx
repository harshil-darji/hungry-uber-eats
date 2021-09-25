import * as React from 'react';
import { useHistory } from 'react-router';
// import { StyledLink } from 'baseui/link';
// import { Layer } from 'baseui/layer';
// import { ChevronDown, Delete, Overflow, Upload } from 'baseui/icon';
// import { AppNavBar, setItemActive } from 'baseui/app-nav-bar';
import { Button } from 'baseui/button';
import { ThemeProvider, createTheme, lightThemePrimitives } from 'baseui';
import logoImage from '../assets/img/ubereats-restaurants.png';
import '../css/RestaurantNavbar.css';

export default function RestaurantNavbar() {
  const history = useHistory();
  return (
    <div className="nav navbar navbar-custom fixed-top">
      <div className="innerDiv">
        <img
          src={logoImage}
          style={{ height: '52px', width: '55px', top: 0 }}
          alt="Logo"
        />

        <div>
          <i
            className="fa fa-user"
            aria-hidden="true"
            style={{ color: 'white' }}
          />
          <Button onClick={() => history.push('/login/restaurant')}>
            Sign in
          </Button>
          <ThemeProvider
            theme={createTheme(lightThemePrimitives, {
              colors: {
                buttonPrimaryFill: '#FFFFF',
                buttonPrimaryText: '#00000',
              },
            })}
          >
            <Button onClick={() => history.push('/register/restaurant')}>
              Sign up
            </Button>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
}
