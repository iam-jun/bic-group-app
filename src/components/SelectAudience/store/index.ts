import { getAudienceIdsFromSelecting } from '~/components/SelectAudience/store/helper';
import { IGroup } from '~/interfaces/IGroup';
import IBaseState from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import getAudienceTree from './actions/getAudienceTree';
import getAudienceSearch from './actions/getAudienceSearch';

export interface ISelectAudienceState extends IBaseState {
  selecting: {
    groups: {[x: string]: any};
    users: {[x: string]: any};
  };
  selectingIds: {
    groupIds: string[];
    userIds: string[];
  }
  tree: {
    data: undefined,
    loading: boolean,
  },
  search: {
    key: string,
    data: undefined,
    loading: boolean,
  }

  actions?: {
    setSelectingGroups: (selectingGroups) => void;
    removeSelectingGroup: (group: IGroup) => void;
    getAudienceTree?: () => void;
    getAudienceSearch?: (key: string) => void;
  }
}

const initState: ISelectAudienceState = {
  selecting: {
    groups: {},
    users: {},
  },
  selectingIds: {
    groupIds: [],
    userIds: [],
  },
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
  actions: {
    setSelectingGroups: (selectingGroups) => {
      const state: ISelectAudienceState = get();
      const users = state.selecting.users || {};

      // filter key with value = false, optimize group tree later
      const filtered = Object.fromEntries(Object.entries(selectingGroups).filter(([key]) => !!selectingGroups[key]));

      const newSelectingIds = getAudienceIdsFromSelecting({ users, groups: filtered });
      set((state: ISelectAudienceState) => {
        state.selecting.groups = filtered;
        state.selectingIds = newSelectingIds;
      }, 'setSelectingGroups');
    },
    removeSelectingGroup: (group: IGroup) => {
      const state: ISelectAudienceState = get();
      const users = state.selecting.users || {};
      const groups = state.selecting.groups || {};
      const newSelectingGroups = { ...groups };
      delete newSelectingGroups[group?.id];
      const newSelectingIds = getAudienceIdsFromSelecting({ users, groups: newSelectingGroups });
      set((state) => {
        state.selecting.groups = newSelectingGroups;
        state.selectingIds = newSelectingIds;
      }, 'removeSelectingGroup');
    },
    getAudienceTree: getAudienceTree(set, get),
    getAudienceSearch: getAudienceSearch(set, get),
  },
  reset: () => resetStore(initState, set),
});

const useSelectAudienceStore = createStore<ISelectAudienceState>(selectAudienceStore);

export default useSelectAudienceStore;
