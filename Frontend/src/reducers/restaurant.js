const initialState = {
  error: '',
  rest: {},
  token: '',
};

const restaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REGISTER_RESTAURANT_REQUEST':
      return state;
    case 'REGISTER_RESTAURANT_SUCCESS':
      return {
        ...state,
        error: '',
        rest: action.payload.data.rest,
        token: action.payload.data.token,
      };
    case 'REGISTER_RESTAURANT_FAILURE':
      return { ...state, error: action.payload, rest: {} };
    case 'LOGIN_RESTAURANT_REQUEST':
      return state;
    case 'LOGIN_RESTAURANT_SUCCESS':
      return {
        ...state,
        error: '',
        token: action.payload.data.token,
      };
    case 'LOGIN_RESTAURANT_FAILURE':
      return { ...state, error: action.payload, rest: {} };
    case 'UPDATE_RESTAURANT_REQUEST':
      return state;
    case 'UPDATE_RESTAURANT_SUCCESS':
      return {
        ...state,
        error: '',
        rest: action.payload.data,
      };
    case 'UPDATE_RESTAURANT_FAILURE':
      return { ...state, error: action.payload, rest: {} };
    default:
      return state;
  }
};
export default restaurantReducer;
