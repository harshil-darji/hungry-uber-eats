import { combineReducers } from 'redux';
import customerReducer from './customer';
import dishReducer from './dish';
import restaurantReducer from './restaurant';
import cartReducer from './cart';
import searchFilterReducer from './searchFilter';

export default combineReducers({
  customer: customerReducer,
  restaurant: restaurantReducer,
  dish: dishReducer,
  cart: cartReducer,
  searchFilter: searchFilterReducer,
});
