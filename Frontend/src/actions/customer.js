export function checkCustomerEmail() {
  return {
    type: 'CHECK_CUSTOMER_EMAIL',
  };
}
export function setCustomerEmail(payload) {
  return {
    type: 'SET_CUSTOMER_EMAIL',
    payload,
  };
}
export function setCustomerPasswd(payload) {
  return {
    type: 'SET_CUSTOMER_PASSWD',
    payload,
  };
}

export function registerCustomerRequest() {
  return {
    type: 'REGISTER_CUSTOMER_REQUEST',
  };
}
export function registerCustomerSuccess(payload) {
  return { type: 'REGISTER_CUSTOMER_SUCCESS', payload };
}
export function registerCustomerFailure(payload) {
  return { type: 'REGISTER_CUSTOMER_FAILURE', payload };
}

export function loginCustomerRequest() {
  return {
    type: 'LOGIN_CUSTOMER_REQUEST',
  };
}
export function loginCustomerSuccess(payload) {
  return {
    type: 'LOGIN_CUSTOMER_SUCCESS',
    payload,
  };
}
export function loginCustomerFailure(payload) {
  return {
    type: 'LOGIN_CUSTOMER_FAILURE',
    payload,
  };
}

export function logoutCustomer() {
  return {
    type: 'LOGOUT_CUSTOMER',
  };
}
