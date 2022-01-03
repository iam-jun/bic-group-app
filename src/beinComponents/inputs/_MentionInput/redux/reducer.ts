import types from './types';

const initMenuState = {
  text: '',
  key: null,
  cursorPosition: -2, // follow MatterMost
  topPosition: 0,
  loading: false,
  data: [],
  highlightIndex: -1,
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
    case types.SET_CURSOR_POSITION:
      return {
        ...state,
        cursorPosition: payload,
      };
    case types.RUN_SEARCH:
      return {
        ...state,
        loading: true,
        key: payload.key,
      };
    case types.SET_DATA:
      return {
        ...state,
        data: payload,
        loading: false,
        key: null,
      };
    case types.SET_HIGHLIGHT_INDEX:
      return {
        ...state,
        highlightIndex: payload,
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
