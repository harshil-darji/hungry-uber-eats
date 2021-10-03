const initialState = {
  dishUpdateFlag: false,
  dishDeleteFlag: false,
  dishes: [],
  dishImages: [],
  error: '',
};

const dishReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DISH_UPDATE_FLAG':
      return { ...state, dishUpdateFlag: action.payload };
    case 'SET_ALL_DISHES':
      return { ...state, dishes: action.payload };
    case 'DELETE_DISH_FLAG':
      return { ...state, dishDeleteFlag: true };
    // case 'UPDATE_DISHES':
    //   return { ...state, dishes: [...state.dishes, action.payload] };
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
