import types from './types';

export const mentionInputInitState = {
  text: '',
  fullContent: '',
  key: null,
  cursorPosition: -2, // follow MatterMost
  topPosition: 0,
  loading: false,
  data: [],
  tempSelected: {},
};

const reducer = (state = mentionInputInitState, action: any = {}) => {
  const {type, payload} = action;

  switch (type) {
    case types.SET_TEXT:
      return {
        ...state,
        text: payload,
      };
    case types.SET_FULL_CONTENT:
      return {
        ...state,
        fullContent: payload,
      };
    case types.SET_CURSOR_POSITION:
      return {
        ...state,
        cursorPosition: payload,
      };
    case types.SET_LOADING:
      return {
        ...state,
        loading: payload,
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
    case types.ADD_TEMP_SELECTED:
      return {
        ...state,
        tempSelected: {...state.tempSelected, ...payload},
      };
    default:
      return state;
  }
};

export default reducer;
