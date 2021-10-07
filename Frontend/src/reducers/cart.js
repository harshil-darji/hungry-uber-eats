const initialState = {
  cartQty: 0,
  cartItems: [],
  error: '',
  cartItemDeleted: false,
  cartUpdatedFlag: false,
  cartResetFlag: false,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART_REQUEST':
      return state;
    case 'ADD_TO_CART_SUCCESS':
      return {
        ...state,
        error: '',
        cartQty: state.cartQty + 1,
        cartItems: action.payload,
      };
    case 'ADD_TO_CART_FAILURE':
      return { ...state, error: action.payload };
    case 'DELETE_FROM_CART_REQUEST':
      return state;
    case 'DELETE_FROM_CART_SUCCESS':
      return { ...state, cartItemDeleted: true, error: '' };
    case 'DELETE_FROM_CART_FAILURE':
      return { ...state, cartItemDeleted: false, error: action.payload };
    case 'RESET_CART_REQUEST':
      return state;
    case 'RESET_CART_SUCCESS':
      return { ...state, cartResetFlag: true, error: '' };
    case 'RESET_CART_FAILURE':
      return { ...state, cartResetFlag: false, error: action.payload };
    case 'CLEAR_CART_REQUEST':
      return state;
    case 'CLEAR_CART_SUCCESS':
      return {
        ...state,
        cartItems: [],
        cartQty: 0,
        error: '',
      };
    case 'CLEAR_CART_FAILURE':
      return { ...state, error: action.payload };
    case 'UPDATE_CART_REQUEST':
      return state;
    case 'UPDATE_CART_SUCCESS':
      return {
        ...state,
        cartUpdatedFlag: true,
        error: '',
      };
    case 'UPDATE_CART_FAILURE':
      return { ...state, error: action.payload, cartUpdatedFlag: false };
    default:
      return state;
  }
};
export default cartReducer;
