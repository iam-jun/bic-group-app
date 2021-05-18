export const initState = {
  loaded: false,
};

/**
 * Common reducer
 * @param state
 * @param action
 * @returns {*}
 */
function commonReducer(state = initState, action: any = {}) {
  const {type} = action;
  switch (type) {
    default:
      return state;
  }
}
export default commonReducer;
