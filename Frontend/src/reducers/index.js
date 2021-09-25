import { combineReducers } from 'redux';
import customerReducer from './customer';
import restaurantReducer from './restaurant';

export default combineReducers({
  customer: customerReducer,
  restaurant: restaurantReducer,
});
