import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Route } from 'react-router';
import CustomerHome from './CustomerHome';
import CustomerNavbar from './CustomerNavbar';

function CustomerDashboard({ match }) {
  return (
    <Container fluid>
      <Row>
        <CustomerNavbar />
      </Row>
      <Row>
        <Route path={`${match.path}/dashboard`} component={CustomerHome} />
      </Row>
    </Container>
  );
}

export default CustomerDashboard;
