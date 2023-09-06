import { IObject } from '~/interfaces/common';
import {
  IInvitedPeople,
  IJoinableUsers, IParamsGetJoinableUsers, IParamsInvitations,
} from '~/interfaces/IGroup';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import getGroupJoinableUsers from './actions/getGroupJoinableUsers';
import setSelectedUsers from './actions/setSelectedUsers';
import invitations from './actions/invitations';
import getInvitations from './actions/getInvitations';
import cancelInvitation from './actions/cancelInvitation';

export interface IGroupJoinableUsersState extends IBaseState {
  data: IObject<IJoinableUsers>;
  loading: boolean;
  users: {
    ids: string[];
    loading: boolean;
    hasNextPage: boolean;
  };
  selectedUsers: string[];
  searchText: string;

  invitedPeople: {
    data: IInvitedPeople[],
    isLoading: boolean,
    isRefreshing: boolean,
    canLoadMore: boolean,
    offset: number;
  }

  actions: {
    getGroupJoinableUsers: (payload: IParamsGetJoinableUsers) => void;
    setSelectedUsers: (userId: string) => void;
    invitations: (params: IParamsInvitations) => void;
    getInvitations: (groupId: string, isRefreshing?: boolean) => Promise<void>;
    cancelInvitation: (invitationId: string) => Promise<void>;
    clearInviteData: () => void;
    clearInvitedPeople: () => void;
    setSearchText: (value: string) => void;
  };
}

const initialState: InitStateType<IGroupJoinableUsersState> = {
  data: {},
  loading: false,
  users: {
    ids: [],
    loading: false,
    hasNextPage: false,
  },
  selectedUsers: [],
  searchText: '',
  invitedPeople: {
    data: [],
    isLoading: false,
    isRefreshing: false,
    canLoadMore: true,
    offset: 0,
  },
};

const groupJoinableUsersStore = (set, get) => ({
  ...initialState,

  actions: {
    getGroupJoinableUsers: getGroupJoinableUsers(set, get),
    setSelectedUsers: setSelectedUsers(set, get),
    invitations: invitations(set, get),
    getInvitations: getInvitations(set, get),
    cancelInvitation: cancelInvitation(set, get),
    clearInviteData: () => {
      set((state: IGroupJoinableUsersState) => {
        state.data = initialState.data;
        state.loading = initialState.loading;
        state.users = initialState.users;
        state.selectedUsers = initialState.selectedUsers;
        state.searchText = initialState.searchText;
      }, 'clearInviteData');
    },
    clearInvitedPeople: () => {
      set((state: IGroupJoinableUsersState) => {
        state.invitedPeople = initialState.invitedPeople;
      }, 'clearInvitedPeople');
    },
    setSearchText: (value: string) => {
      set((state: IGroupJoinableUsersState) => {
        state.searchText = value;
      }, 'setSearchText');
    },
  },

  reset: () => resetStore(initialState, set),
});

const useGroupJoinableUsersStore = createStore<IGroupJoinableUsersState>(groupJoinableUsersStore);

export default useGroupJoinableUsersStore;
