import { IGroupGetMembers } from '~/interfaces/IGroup';
import IBaseState from '~/store/interfaces/IBaseState';
import { createStore } from '~/store/utils';
import getGroupMembers from './actions/getGroupMembers';
import removeGroupMember from './actions/removeGroupMember';

export interface IGroupMemberState extends IBaseState {
  groupMembers: {
    loading: boolean;
    canLoadMore: boolean;
    offset: number; // current fetched data count
  };
  actions: {
    deleteRemoveGroupMember: (payload: { groupId: string; userId: string }) => void;
    getGroupMembers: (payload: IGroupGetMembers) => void;
    setGroupMembers: (payload: any) => void;
    clearGroupMembers: () => void;
  };
}

const initialState = {
  groupMembers: {
    loading: true,
    canLoadMore: true,
    offset: 0,
  },
};

const groupMemberStore = (set, get) => ({
  ...initialState,
  actions: {
    deleteRemoveGroupMember: removeGroupMember(),
    getGroupMembers: getGroupMembers(set, get),
    setGroupMembers: (payload: any) => {
      set((state: IGroupMemberState) => {
        state.groupMembers = payload;
      }, 'setGroupMembers');
    },
    clearGroupMembers: () => {
      set((state: IGroupMemberState) => {
        state.groupMembers = initialState.groupMembers;
      }, 'clearGroupMembers');
    },
  },
});

const useGroupMemberStore = createStore<IGroupMemberState>(groupMemberStore);

export default useGroupMemberStore;
