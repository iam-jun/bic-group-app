import {IParamSearchMentionAudiences} from '~/interfaces/IPost';
import types from './types';

export default {
  setText: (payload: string) => {
    return {
      type: types.SET_TEXT,
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
  sethHighlightItem: (payload: any) => {
    return {
      type: types.SET_HIGHLIGHT_ITEM,
      payload,
    };
  },
};
