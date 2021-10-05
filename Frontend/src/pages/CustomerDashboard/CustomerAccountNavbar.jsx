/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import toast from 'react-hot-toast';
import jwt_decode from 'jwt-decode';
import { Container, Nav, Navbar } from 'react-bootstrap';

import axiosInstance from '../../services/apiConfig';

import '../../css/CustomerAccountNavbar.css';

function CustomerAccountNavbar() {
  const [name, setName] = useState('');
  const history = useHistory();

  const fetchCustomerData = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(`customers/${decoded.id}`, {
        headers: { Authorization: token },
      });
      const { user } = response.data;
      setName(user.name);
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/customer');
        }
      }
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
