import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Route, useHistory } from 'react-router';
import CustomerAccount from './CustomerAccount';
import CustomerHome from './CustomerHome';
import CustomerNavbar from './CustomerNavbar';
import CustomerFavourites from './CustomerFavourites';
import CustomerAccountNavbar from './CustomerAccountNavbar';

function CustomerDashboard({ match }) {
  const history = useHistory();
  const custAccountPathsRegex = /customer\/account(\/)*(.)*/;

  return (
    <Container fluid>
      {!custAccountPathsRegex.test(history.location.pathname) ? (
        <Row>
          <CustomerNavbar />
        </Row>
      ) : (
        <Row>
          <CustomerAccountNavbar />
        </Row>
      )}
      <Row>
        <Route path={`${match.path}/dashboard`} component={CustomerHome} />
        <Route path={`${match.path}/account`} component={CustomerAccount} />
        <Route
          path={`${match.path}/favourites`}
          component={CustomerFavourites}
        />
      </Row>
    </Container>
  );
}

export default CustomerDashboard;
