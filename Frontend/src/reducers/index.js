import { combineReducers } from 'redux';
import customerReducer from './customer';
import dishReducer from './dish';
import restaurantReducer from './restaurant';

export default combineReducers({
  customer: customerReducer,
  restaurant: restaurantReducer,
  dish: dishReducer,
});
