import getJoinedGroupSearch from './actions/getJoinedGroupSearch';
import getJoinedGroupTree from './actions/getJoinedGroupTree';
import { createStore, resetStore } from '~/store/utils';
import ICommunityJoinedGroupTreeState from './Interface';

const initialState = {
  data: {},
  loading: false,
  searchKey: '',
  searchResult: [],
  searchHasNextPage: true,
};

const communityJoinedGroupTreeStore = (set, get) => ({
  ...initialState,
  actions: {
    setSearchKey: (key: string) => {
      set((state: ICommunityJoinedGroupTreeState) => {
        state.searchKey = key;
        if (!key) {
          state.searchResult = [];
          state.searchHasNextPage = true;
        }
      }, 'setSearchKey');
    },

    getJoinedGroupTree: getJoinedGroupTree(set, get),
    getJoinedGroupSearch: getJoinedGroupSearch(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const useCommunityJoinedGroupTreeStore = createStore<ICommunityJoinedGroupTreeState>(communityJoinedGroupTreeStore);

export default useCommunityJoinedGroupTreeStore;
