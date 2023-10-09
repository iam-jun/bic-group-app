import { IGroup } from '~/interfaces/IGroup';
import IBaseState from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import getAudienceTree from './actions/getAudienceTree';
import getAudienceSearch from './actions/getAudienceSearch';
import { IUser } from '~/interfaces/IAuth';
import { getAudienceIdsFromSelecting } from './helper';
import getAllGroupJoinedSearch from './actions/getAllGroupJoinedSearch';

export enum ContentType {
  POST = 'post',
  ARTICLE = 'article',
  SERIES = 'series',
}

export interface ISelectAudienceState extends IBaseState {
  selectedAudiences: {
    groups: {[x: string]: any};
    users: {[x: string]: any};
  };
  selectedIds: {
    groupIds: string[];
    userIds: string[];
  };
  tree: {
    data: undefined,
    loading: boolean,
  };
  search: {
    key: string,
    data: any[] | undefined,
    loading: boolean,
    hasNextPage: boolean,
    contentType?: ContentType,
  };
  actions?: {
    getAudienceTree?: () => void;
    getAudienceSearch?: (key: string, contentType: ContentType, isRefresh: boolean) => void;
    getAllGroupJoinedSearch: (key: string, isRefresh: boolean) => void;
    setSelectedAudiences: (selectedAudiences) => void;
    updateItemSelection: (group: IGroup | IUser, isSelected: boolean) => void;
  };
}

const initState: ISelectAudienceState = {
  selectedAudiences: {
    groups: {},
    users: {},
  },
  selectedIds: {
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
    loading: false,
    hasNextPage: true,
    contentType: undefined,
  },
};

const selectAudienceStore = (set, get) => ({
  ...initState,
  actions: {
    setSelectedAudiences: (selectedAudiences) => {
      const state: ISelectAudienceState = get();
      const users = state.selectedAudiences.users || {};

      // filter key with value = false, optimize group tree later
      const groups = Object.fromEntries(Object.entries(
        selectedAudiences,
      ).filter(([key]) => !!selectedAudiences[key]));

      const newSelectedIds = getAudienceIdsFromSelecting({ users, groups });

      set((state: ISelectAudienceState) => {
        state.selectedAudiences.groups = groups;
        state.selectedIds = newSelectedIds;
      }, 'setSelectedAudiences');
    },
    updateItemSelection: (item: IGroup & IUser, isSelected: boolean) => {
      const isUser = item?.username;
      const field = isUser ? 'users' : 'groups';
      const fieldIds = isUser ? 'userIds' : 'groupIds';

      set((state: ISelectAudienceState) => {
        const isItemExisted = state.selectedAudiences[field]?.[item.id];

        // add item
        if (isSelected) {
          if (!isItemExisted) {
            state.selectedAudiences[field][item.id] = item;
            state.selectedIds[fieldIds]?.push?.(item.id);
          }
        // remove item
        } else {
          const { selectedIds } = state;

          if (isItemExisted) {
            delete state.selectedAudiences[field]?.[item.id];
            state.selectedIds[fieldIds] = selectedIds[fieldIds]?.filter?.((id) => item.id !== id);
          }
        }
      }, `updateItemSelection: ${isSelected}`);
    },
    getAudienceTree: getAudienceTree(set, get),
    getAudienceSearch: getAudienceSearch(set, get),
    getAllGroupJoinedSearch: getAllGroupJoinedSearch(set, get),
  },
  reset: () => resetStore(initState, set),
});

const useSelectAudienceStore = createStore<ISelectAudienceState>(selectAudienceStore);

export default useSelectAudienceStore;
