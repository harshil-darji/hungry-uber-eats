const initialState = {
  city: null,
  deliveryType: null,
  restType: null,
  searchQuery: '',
};

const searchFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, city: action.payload };
    case 'SET_DELIVERY_TYPE':
      return { ...state, deliveryType: action.payload };
    case 'SET_REST_TYPE':
      return { ...state, restType: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};
export default searchFilterReducer;
