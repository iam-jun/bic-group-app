import {IParamSearchMentionAudiences} from '~/interfaces/IPost';
import types from './types';

const mentionActions = {
  setText: (payload: string) => {
    return {
      type: types.SET_TEXT,
      payload,
    };
  },
  setCursorPosition: (payload: number) => {
    return {
      type: types.SET_CURSOR_POSITION,
      payload,
    };
  },
  setLoading: (payload: boolean) => {
    return {
      type: types.SET_LOADING,
      payload,
    };
  },
  runSearch: (payload: IParamSearchMentionAudiences) => {
    return {
      type: types.RUN_SEARCH,
      payload,
    };
  },
  setData: (payload: any) => {
    return {
      type: types.SET_DATA,
      payload,
    };
  },
  sethHighlightIndex: (payload: number) => {
    return {
      type: types.SET_HIGHLIGHT_INDEX,
      payload,
    };
  },
  sethHighlightItem: (payload: any) => {
    return {
      type: types.SET_HIGHLIGHT_ITEM,
      payload,
    };
  },
};

export default mentionActions;
