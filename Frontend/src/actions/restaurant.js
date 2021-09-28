export function registerRestaurantRequest() {
  return {
    type: 'REGISTER_RESTAURANT_REQUEST',
  };
}
export function registerRestaurantSuccess(payload) {
  return { type: 'REGISTER_RESTAURANT_SUCCESS', payload };
}
export function registerRestaurantFailure(payload) {
  return { type: 'REGISTER_RESTAURANT_FAILURE', payload };
}

export function loginRestaurantRequest() {
  return {
    type: 'LOGIN_RESTAURANT_REQUEST',
  };
}
export function loginRestaurantSuccess(payload) {
  return { type: 'LOGIN_RESTAURANT_SUCCESS', payload };
}
export function loginRestaurantFailure(payload) {
  return { type: 'LOGIN_RESTAURANT_FAILURE', payload };
}

export function updateRestaurantRequest() {
  return {
    type: 'UPDATE_RESTAURANT_REQUEST',
  };
}
export function updateRestaurantSuccess(payload) {
  return { type: 'UPDATE_RESTAURANT_SUCCESS', payload };
}
export function updateRestaurantFailure(payload) {
  return { type: 'UPDATE_RESTAURANT_FAILURE', payload };
}
