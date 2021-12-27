import types from './types';

const initMenuState = {
  text: '',
  data: [],
  highlightItem: null,
};

const reducer = (state = initMenuState, action: any = {}) => {
  const {type, payload} = action;

  switch (type) {
    case types.SET_TEXT:
      return {
        ...state,
        text: payload,
      };
    case types.SET_DATA:
      return {
        ...state,
        data: payload,
      };
    case types.SET_HIGHLIGHT_ITEM:
      return {
        ...state,
        highlightItem: payload,
      };
    default:
      return state;
  }
};

export default reducer;
