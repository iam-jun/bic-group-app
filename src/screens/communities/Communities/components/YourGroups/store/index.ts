import { createStore, resetStore } from '~/store/utils';
import getYourGroups from './actions/getYourGroups';
import { IYourGroupsState } from './Interface';

const initYourGroupsState: IYourGroupsState = {
  ids: [],
  items: {},
  loading: false,
  hasNextPage: true,
  refreshing: false,
};

const yourGroupsState = (set, get): IYourGroupsState => ({
  ...initYourGroupsState,
  actions: {
    getYourGroups: getYourGroups(set, get),
  },
  reset: () => resetStore(initYourGroupsState, set),
});

const useYourGroupsStore = createStore<IYourGroupsState>(yourGroupsState);

export default useYourGroupsStore;
