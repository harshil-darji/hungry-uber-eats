const initialState = {
  emailId: '',
  passwd: '',
  token: '',
  error: '',
  cust: {},
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CUSTOMER_EMAIL':
      return { ...state, emailId: action.payload };
    case 'SET_CUSTOMER_PASSWD':
      return { ...state, passwd: action.payload };
    case 'REGISTER_CUSTOMER_REQUEST':
      return state;
    case 'REGISTER_CUSTOMER_SUCCESS':
      return {
        ...state,
        error: '',
        cust: action.payload.data.cust,
        token: action.payload.data.token,
      };
    case 'REGISTER_CUSTOMER_FAILURE':
      return { ...state, error: action.payload, cust: {} };
    case 'LOGIN_CUSTOMER_REQUEST':
      return state;
    case 'LOGIN_CUSTOMER_SUCCESS':
      return {
        ...state,
        error: '',
        cust: action.payload.data.cust,
        token: action.payload.data.token,
      };
    case 'LOGIN_CUSTOMER_FAILURE':
      return { ...state, error: action.payload, cust: {} };
    case 'LOGOUT_CUSTOMER':
      sessionStorage.removeItem('token');
      return initialState;
    case 'UPDATE_CUSTOMER_REQUEST':
      return state;
    case 'UPDATE_CUSTOMER_SUCCESS':
      return { ...state, cust: action.payload };
    case 'UPDATE_CUSTOMER_FAILURE':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
export default customerReducer;
