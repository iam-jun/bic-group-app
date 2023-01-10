import { IGroupGetMembers } from '~/interfaces/IGroup';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore } from '~/store/utils';
import assignGroupAdmin from './actions/assignGroupAdmin';
import getGroupMembers from './actions/getGroupMembers';
import removeGroupMember from './actions/removeGroupMember';
import revokeGroupAdmin from './actions/revokeGroupAdmin';
import updateGroupJoinSetting from './actions/updateGroupJoinSetting';

export interface IGroupMemberState extends IBaseState {
  groupMembers: {
    loading: boolean;
    canLoadMore: boolean;
    offset: number; // current fetched data count
  };
  actions: {
    deleteRemoveGroupMember: (payload: { groupId: string; userId: string }) => void;
    getGroupMembers: (payload: IGroupGetMembers) => void;
    clearGroupMembers: () => void;
    updateGroupJoinSetting: (payload: { groupId: string; isJoinApproval: boolean }) => void;
    assignGroupAdmin: (groupId: string, userIds: string[]) => void;
    revokeGroupAdmin: (groupId: string, userId: string) => void;
  };
}

const initialState: InitStateType<IGroupMemberState> = {
  groupMembers: {
    loading: true,
    canLoadMore: true,
    offset: 0,
  },
};

const groupMemberStore = (set, get) => ({
  ...initialState,
  actions: {
    deleteRemoveGroupMember: removeGroupMember(set, get),
    getGroupMembers: getGroupMembers(set, get),
    clearGroupMembers: () => {
      set((state: IGroupMemberState) => {
        state.groupMembers = initialState.groupMembers;
      }, 'clearGroupMembers');
    },
    updateGroupJoinSetting: updateGroupJoinSetting(set, get),
    assignGroupAdmin: assignGroupAdmin(set, get),
    revokeGroupAdmin: revokeGroupAdmin(set, get),
  },
});

const useGroupMemberStore = createStore<IGroupMemberState>(groupMemberStore);

export default useGroupMemberStore;
