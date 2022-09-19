import getJoinedGroupTree from './actions/getJoinedGroupTree';
import { createStore, resetStore } from '~/store/utils';
import ICommunityJoinedGroupTreeState from './Interface';

const initialState = {
  data: {},
  loading: false,
  searchKey: '',
  searchResult: [],
};

const communityJoinedGroupTreeStore = (set, get) => ({
  ...initialState,
  actions: {
    setSearchKey: (key: string) => {
      set((state: ICommunityJoinedGroupTreeState) => {
        state.searchKey = key;
      });
    },

    getJoinedGroupTree: getJoinedGroupTree(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const useCommunityJoinedGroupTreeStore = createStore<ICommunityJoinedGroupTreeState>(communityJoinedGroupTreeStore);

export default useCommunityJoinedGroupTreeStore;
