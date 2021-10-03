// eslint-disable-next-line import/prefer-default-export
export function setDishUpdateFlag(payload) {
  return {
    type: 'SET_DISH_UPDATE_FLAG',
    payload,
  };
}
export function setAllDishes(payload) {
  return {
    type: 'SET_ALL_DISHES',
    payload,
  };
}
// export function updateDishes(payload) {
//   return {
//     type: 'UPDATE_DISHES',
//     payload,
//   };
// }
export function setDeleteDishFlag(payload) {
  return {
    type: 'DELETE_DISH_FLAG',
    payload,
  };
}
export function addDishImageRequest() {
  return {
    type: 'ADD_DISH_IMAGE_REQUEST',
  };
}
export function addDishImageSuccess(payload) {
  return {
    type: 'ADD_DISH_IMAGE_SUCCESS',
    payload,
  };
}
export function addDishImageFailure(payload) {
  return {
    type: 'ADD_DISH_IMAGE_FAILURE',
    payload,
  };
}
