import streamApi from '~/api/StreamApi';
import { getMatchTermForAtMention } from '../../helper';
import IMentionInputState from '../Interface';

const SEARCH_LIMIT = 10;

const runSearch = (set, get) => async (groupIds: string, payload: string, ignoreMatchTerm: boolean) => {
  const {
    fullContent, loading, data, key,
  } = get();
  if (loading) return;
  let _matchTerm = null;

  if (ignoreMatchTerm) {
    _matchTerm = payload;
  } else {
    _matchTerm = getMatchTermForAtMention(payload);
  }

  // if key changed, update new data else load more data
  const keyChanged = key !== _matchTerm;

  // if matchTearm ends with space, it will trigger search again
  if (_matchTerm !== null && !_matchTerm?.endsWith(' ')) {
    set((state) => {
      state.loading = true;
      state.key = _matchTerm;
    }, 'runSearch');

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
        state.loading = false;
        state.data = keyChanged ? newData : state.data.concat(newData);
        state.canLoadMore = canLoadMore;

        if (!canLoadMore) {
          state.key = null;
        }
      }, 'runSearchSuccess');
    } catch (error) {
      set((state: IMentionInputState) => {
        state.loading = false;
        state.key = null;
        state.error = error;
      }, 'runSearchError');
    }
  } else {
    set((state: IMentionInputState) => {
      state.loading = false;
      state.key = null;
      state.error = null;
      state.data = [];
    }, 'runSearchReset');
  }
};

export default runSearch;
