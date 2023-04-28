import { IObject } from '~/interfaces/common';
import { IJoinableUsers, IParamsGetJoinableUsers } from '~/interfaces/IGroup';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import addUsersToGroup from './actions/addUsersToGroup';
import getGroupJoinableUsers from './actions/getGroupJoinableUsers';
import setSelectedUsers from './actions/setSelectedUsers';

export interface IGroupJoinableUsersState extends IBaseState {
  data: IObject<IJoinableUsers>;
  users: {
    ids: string[];
    loading: boolean;
    hasNextPage: boolean;
  };
  selectedUsers: string[];

  actions: {
    getGroupJoinableUsers: (payload: IParamsGetJoinableUsers) => void;
    setSelectedUsers: (userId: string) => void;
    addUsersToGroup: (groupId: string) => void;
  };
}

const initialState: InitStateType<IGroupJoinableUsersState> = {
  data: {},
  users: {
    ids: [],
    loading: false,
    hasNextPage: false,
  },
  selectedUsers: [],
};

const groupJoinableUsersStore = (set, get) => ({
  ...initialState,

  actions: {
    getGroupJoinableUsers: getGroupJoinableUsers(set, get),
    setSelectedUsers: setSelectedUsers(set, get),
    addUsersToGroup: addUsersToGroup(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useGroupJoinableUsersStore = createStore<IGroupJoinableUsersState>(groupJoinableUsersStore);

export default useGroupJoinableUsersStore;
