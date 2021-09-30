const initialState = {
  dishes: [],
  dishImages: [],
  error: '',
};

const dishReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_DISHES':
      return { ...state, dishes: [...state.dishes, action.payload] };
    case 'ADD_DISH_IMAGE_REQUEST':
      return state;
    case 'ADD_DISH_IMAGE_SUCCESS':
      return { ...state, dishes: [...state.dishImages, action.payload] };
    case 'ADD_DISH_IMAGE_FAILURE':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
export default dishReducer;
