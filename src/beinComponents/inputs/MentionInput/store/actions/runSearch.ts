import streamApi from '~/api/StreamApi';
import { getMatchTermForAtMention } from '../../helper';
import IMentionInputState from '../Interface';

const SEARCH_LIMIT = 10;

const runSearch = (set, get) => async (payload: string) => {
  const _matchTerm = getMatchTermForAtMention(payload);

  if (_matchTerm !== null && !_matchTerm.endsWith(' ')) {
    set((state) => {
      state.loading = true;
      state.key = _matchTerm;
    }, 'runSearch');

    const { groupIds, fullContent, data } = get();

    try {
      const response = await streamApi.getSearchMentionAudiences({
        groupIds,
        key: _matchTerm,
        limit: SEARCH_LIMIT,
        offset: data.length,
      });

      const responseData = response?.data || [];
      const canLoadMore = responseData.length === SEARCH_LIMIT;

      set((state: IMentionInputState) => {
        const newData: any[] = fullContent ? responseData : [];

        state.data = state.data.concat(newData);
        state.canLoadMore = canLoadMore;
        if (!canLoadMore) { state.key = null; }
      }, 'runSearchSuccess');
    } catch (error) {
      set((state: IMentionInputState) => {
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
