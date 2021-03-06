/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
import React, { useCallback, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { Container, Nav, Navbar } from 'react-bootstrap';

import axios from 'axios';

import '../../css/CustomerAccountNavbar.css';
import { getCustomerQuery } from '../../services/query';

function CustomerAccountNavbar() {
  const [name, setName] = useState('');

  const fetchCustomerData = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axios({
        url: 'http://127.0.0.1:8081/api/',
        method: 'post',
        data: {
          query: getCustomerQuery,
          variables: {
            custId: decoded.id,
          },
        },
        headers: {
          Authorization: token,
        },
      });
      const user = response.data.data.customer;
      setName(user.name);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  return (
    <Navbar
      className="colorNav"
      variant="dark"
      style={{ width: '100%', height: '60px' }}
    >
      <Container>
        <Navbar.Brand
          href="/customer/dashboard"
          style={{ fontWeight: 'bold', fontSize: 'x-large' }}
        >
          Uber
        </Navbar.Brand>
        <Nav className="mr-auto ml-5">
          <Nav.Link className="ml-3 whiteNavLink">Ride</Nav.Link>
          <Nav.Link className="ml-3 whiteNavLink">Drive</Nav.Link>
          <Nav.Link className="ml-3 whiteNavLink">More</Nav.Link>
        </Nav>
        <Nav className="me-auto">
          <Nav.Link className="whiteNavLink">Help</Nav.Link>
          <Nav.Link className="whiteNavLink">{name || ''}</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default CustomerAccountNavbar;
