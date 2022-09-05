import { createZustand, resetZustand } from '~/store/utils';
import getAudienceTree from './actions/getAudienceTree';
import ISelectAudienceState from '~/screens/post/PostSelectAudience/store/Interface';
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
    }, false, 'setSearch');
  },

  dispatchGetAudienceTree: getAudienceTree(set, get),
  dispatchGetAudienceSearch: getAudienceSearch(set, get),

  reset: () => resetZustand(initState, set),
});

const useSelectAudienceStore = createZustand<ISelectAudienceState>(
  'select-audience-store', selectAudienceStore,
);

export default useSelectAudienceStore;
