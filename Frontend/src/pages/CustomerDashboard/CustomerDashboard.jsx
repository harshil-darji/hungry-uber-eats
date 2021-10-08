/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Route } from 'react-router';
import CustomerAccount from './CustomerAccount';
import CustomerHome from './CustomerHome';
import CustomerNavbar from './CustomerNavbar';
import CustomerFavourites from './CustomerFavourites';
import RestaurantDetails from './RestaurantDetails';
import CustomerCheckout from './CustomerCheckout';
import CustomerOrders from './CustomerOrders';

const RouteWithNavbar = ({
  exact, path, component: Component, ...rest
}) => (
  <Route
    exact={exact}
    path={path}
    {...rest}
    render={(routeProps) => (
      <Container fluid>
        <Row>
          <CustomerNavbar {...routeProps} />
        </Row>
        <Row>
          <Component {...routeProps} />
        </Row>
      </Container>
    )}
  />
);

function CustomerDashboard({ match }) {
  return (
    <Container fluid>
      <Row>
        <RouteWithNavbar path={`${match.path}/dashboard`} component={CustomerHome} />
        <Route path={`${match.path}/account`} component={CustomerAccount} />
        <RouteWithNavbar
          path={`${match.path}/restaurants/:restId`}
          component={RestaurantDetails}
        />
        <RouteWithNavbar
          path={`${match.path}/favourites`}
          component={CustomerFavourites}
        />
        <Route path={`${match.path}/checkout`} component={CustomerCheckout} />
        <Route path={`${match.path}/orders`} component={CustomerOrders} />
      </Row>
    </Container>
  );
}

export default CustomerDashboard;
