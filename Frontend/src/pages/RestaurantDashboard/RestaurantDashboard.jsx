import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Route } from 'react-router';
import Sidebar from '../../components/RestSidebar';
import '../../css/Sidebar.css';
import CustomerProfile from './CustomerProfile';
import RestaurantHome from './RestaurantHome';
import RestaurantMenu from './RestaurantMenu';
import RestaurantOrders from './RestaurantOrders';
import RestaurantSettings from './RestaurantSettings';

const RestaurantDashboard = ({ match }) => (
  <Container fluid>
    <Row>
      <Col xs={2} id="sidebar-wrapper">
        <Sidebar />
      </Col>
      <Col xs={10} id="page-content-wrapper">
        <Route path={`${match.path}/dashboard`} component={RestaurantHome} />
        <Route path={`${match.path}/menu`} component={RestaurantMenu} />
        <Route
          path={`${match.path}/settings`}
          component={RestaurantSettings}
        />
        <Route path={`${match.path}/orders`} component={RestaurantOrders} />
        <Route path={`${match.path}/customer/:custId`} component={CustomerProfile} />
      </Col>
    </Row>
  </Container>
);

export default RestaurantDashboard;
