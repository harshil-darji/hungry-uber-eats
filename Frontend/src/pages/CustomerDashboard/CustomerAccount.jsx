/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Route, useHistory } from 'react-router';
import { Col, Container, Row } from 'react-bootstrap';
import '../../css/CustomerAccount.css';
import CustomerAccountProfile from './CustomerAccountProfile';

function CustomerAccount({ match }) {
  const history = useHistory();

  return (
    <Container fluid>
      <Row>
        <Col
          xs={{ span: 2, offset: 2 }}
          md={{ span: 2, offset: 2 }}
          lg={{ span: 2, offset: 2 }}
        >
          <div style={{ marginLeft: '70px', marginTop: '20px' }}>
            <p
              className={`links ${
                history.location.pathname === 'customer/account/rides'
                  ? 'bgcolor'
                  : ''
              }`}
              onClick={() => history.push('/customer/account/rides')}
            >
              Request a ride
            </p>
            <p
              className={`links ${
                history.location.pathname === 'customer/account/trips'
                  ? 'bgcolor'
                  : ''
              }`}
              onClick={() => history.push('/customer/account/trips')}
            >
              My trips
            </p>
            <p
              className={`links ${
                history.location.pathname === 'customer/account/wallet'
                  ? 'bgcolor'
                  : ''
              }`}
              onClick={() => history.push('/customer/account/wallet')}
            >
              Wallet
            </p>
            <p
              className={`links ${
                history.location.pathname === 'customer/account/profile'
                  ? 'bgcolor'
                  : ''
              }`}
              onClick={() => history.push('/customer/account/profile')}
            >
              Profile settings
            </p>
            <p
              className={`links ${
                history.location.pathname === 'customer/account/tax'
                  ? 'bgcolor'
                  : ''
              }`}
              onClick={() => history.push('/customer/account/tax')}
            >
              Tax profile
            </p>
          </div>
        </Col>
        <Col>
          <Route
            exact
            path={`${match.path}`}
            render={() => (
              <div style={{ marginTop: '30px' }}>
                Update profile in profile settings
              </div>
            )}
          />
          <Route
            path={`${match.path}/profile`}
            component={CustomerAccountProfile}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default CustomerAccount;
