import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers/index';

const { createStore, applyMiddleware } = require('redux');
const thunkMiddleware = require('redux-thunk').default;

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware)),
);

export default store;
