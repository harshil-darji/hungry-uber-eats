/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const customer = useSelector((state) => state.customer);
  return (
    <Route
      {...restOfProps}
      render={(props) => (customer.cust.token ? <Component {...props} /> : <Redirect to="/" />)}
    />
  );
}

export default ProtectedRoute;
