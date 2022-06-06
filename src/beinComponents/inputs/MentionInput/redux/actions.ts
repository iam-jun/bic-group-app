import {IParamSearchMentionAudiences} from '~/interfaces/IPost';
import types from './types';

const mentionActions = {
  setText: (payload: string) => {
    return {
      type: types.SET_TEXT,
      payload,
    };
  },
  setFullContent: (payload: string) => {
    return {
      type: types.SET_FULL_CONTENT,
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
  addTempSelected: (payload: {[x: string]: any}) => {
    return {
      type: types.ADD_TEMP_SELECTED,
      payload,
    };
  },
};

export default mentionActions;
