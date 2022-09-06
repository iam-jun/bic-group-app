import { createStore, resetStore } from '~/store/utils';
import getAudienceTree from './actions/getAudienceTree';
import ISelectAudienceState from './Interface';
import getAudienceSearch from './actions/getAudienceSearch';

const initState: ISelectAudienceState = {
  tree: {
    data: undefined,
    loading: true,
  },
  search: {
    key: '',
    data: undefined,
    loading: true,
  },
};

const selectAudienceStore = (set, get) => ({
  ...initState,
  setSearch: (payload?: any) => {
    set((state) => {
      state.search = payload || {};
    });
  },
  dispatchGetAudienceTree: () => getAudienceTree(set, get),
  dispatchGetAudienceSearch: getAudienceSearch(set, get),
  reset: () => resetStore(initState, set),
});

const useSelectAudienceStore = createStore<ISelectAudienceState>(
  'select-audience-store', selectAudienceStore,
);

export default useSelectAudienceStore;
