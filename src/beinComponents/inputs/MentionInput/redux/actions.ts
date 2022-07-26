import { IParamSearchMentionAudiences } from '~/interfaces/IPost';
import types from './types';

const mentionActions = {
  setText: (payload: string) => ({
    type: types.SET_TEXT,
    payload,
  }),
  setFullContent: (payload: string) => ({
    type: types.SET_FULL_CONTENT,
    payload,
  }),
  setCursorPosition: (payload: number) => ({
    type: types.SET_CURSOR_POSITION,
    payload,
  }),
  setLoading: (payload: boolean) => ({
    type: types.SET_LOADING,
    payload,
  }),
  runSearch: (payload: IParamSearchMentionAudiences) => ({
    type: types.RUN_SEARCH,
    payload,
  }),
  setData: (payload: any) => ({
    type: types.SET_DATA,
    payload,
  }),
  addTempSelected: (payload: {[x: string]: any}) => ({
    type: types.ADD_TEMP_SELECTED,
    payload,
  }),
};

export default mentionActions;
