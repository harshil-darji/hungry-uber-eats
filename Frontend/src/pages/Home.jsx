/* eslint-disable import/extensions */
import React from 'react';
import { Input } from 'baseui/input';
import { Button } from 'baseui/button';
import Main from '../layout/Main.jsx';
import '../css/Home.css';
import Navbar from '../layout/Navbar';
import SVGComponent1 from '../components/svg1.jsx';
import SVGComponent2 from '../components/svg2.jsx';

function home() {
  const [value, setValue] = React.useState('Enter Delivery Address');

  return (
    <Main>
      <Navbar />
      <div style={{ position: 'relative' }}>
        <div
          style={{
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            backgroundColor: 'rgb(255, 192, 67)',
          }}
        >
          <SVGComponent1
            style={{ height: '100%', objectFit: 'cover' }}
          />
          <div style={{ flex: '1 0 300px' }} />
          <SVGComponent2
            style={{ height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          top: 0,
          justifyContent: 'center',
        }}
      >
        <h1
          style={{
            fontWeight: 'bolder',
            fontSize: '3em',
            marginLeft: '40px',
          }}
        >
          Want food? Get food.
        </h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginLeft: '40px',
          }}
        >
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Controlled Input"
            clearOnEscape
            startEnhancer={
              <i className="fa fa-map-marker" aria-hidden="true" />
            }
          />
          <Button
            style={{ marginLeft: '20px', width: '200px' }}
            onClick={() => alert('click')}
          >
            Find Food
          </Button>
        </div>
      </div>
    </Main>
  );
}

export default home;
