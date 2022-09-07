import streamApi from '~/api/StreamApi';
import { IParamSearchMentionAudiences } from '~/interfaces/IPost';
import { getMatchTermForAtMention } from '../../helper';
import IMentionInputState from '../Interface';

const runSearch = (set, get) => async (payload: IParamSearchMentionAudiences) => {
  const _matchTerm = getMatchTermForAtMention(payload.key);

  if (_matchTerm !== null && !_matchTerm.endsWith(' ')) {
    set((state) => {
      state.loading = true;
      state.key = payload.key;
    });

    const fullContent = get((state: IMentionInputState) => state.fullContent);

    try {
      const response = await streamApi.getSearchMentionAudiences(payload);
      set((state) => {
        state.data = fullContent
          ? response?.data || []
          : [];

        state.key = null;
      }, 'runSearchSuccess');
    } catch (error) {
      set((state) => {
        state.loading = false;
        state.key = null;
        state.error = error;
      }, 'runSearchError');
    }
  } else {
    set((state) => {
      state.data = [];
    });
  }
};

export default runSearch;
