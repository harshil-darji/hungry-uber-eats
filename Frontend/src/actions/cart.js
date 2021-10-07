export function addToCartRequest() {
  return { type: 'ADD_TO_CART_REQUEST' };
}
export function addToCartSuccess(payload) {
  return { type: 'ADD_TO_CART_SUCCESS', payload };
}
export function addtoCartFailure(payload) {
  return { type: 'ADD_TO_CART_FAILURE', payload };
}

export function deleteFromCartRequest() {
  return { type: 'DELETE_FROM_CART_REQUEST' };
}
export function deleteFromCartSuccess() {
  return { type: 'DELETE_FROM_CART_SUCCESS' };
}
export function deleteFromFailure(payload) {
  return { type: 'DELETE_FROM_CART_FAILURE', payload };
}

export function resetCartRequest() {
  return { type: 'RESET_CART_REQUEST' };
}
export function resetCartSuccess() {
  return { type: 'RESET_CART_SUCCESS' };
}
export function resetCartFailure(payload) {
  return { type: 'RESET_CART_FAILURE', payload };
}
