import {
  IGroupGetMembers,
  IJoiningMember,
  IPayloadGetGroupMemberRequests,
  IPayloadSetGroupMemberRequests,
  IPayloadApproveAllGroupMemberRequests,
  IPayloadApproveSingleGroupMemberRequest,
  IPayloadDeclineAllGroupMemberRequests,
  IPayloadDeclineSingleGroupMemberRequest,
} from '~/interfaces/IGroup';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { IObject } from '~/interfaces/common';
import { createStore } from '~/store/utils';
import assignGroupAdmin from './actions/assignGroupAdmin';
import getGroupMembers from './actions/getGroupMembers';
import removeGroupMember from './actions/removeGroupMember';
import revokeGroupAdmin from './actions/revokeGroupAdmin';
import updateGroupJoinSetting from './actions/updateGroupJoinSetting';
import getGroupMemberRequests from './actions/getGroupMemberRequests';
import approveAllGroupMemberRequests from './actions/approveAllGroupMemberRequests';
import approveSingleGroupMemberRequest from './actions/approveSingleGroupMemberRequest';
import declineAllGroupMemberRequests from './actions/declineAllGroupMemberRequests';
import declineSingleGroupMemberRequest from './actions/declineSingleGroupMemberRequest';

export interface IGroupMemberState extends IBaseState {
  groupMembers: {
    loading: boolean;
    canLoadMore: boolean;
    offset: number; // current fetched data count
  };
  groupMemberRequests: {
    total: number;
    loading: boolean;
    canLoadMore: boolean;
    ids: string[];
    items: IObject<IJoiningMember>;
  };
  // temporarily stores data for `undo` action
  undoGroupMemberRequests: {
    total: number;
    loading: boolean;
    canLoadMore: boolean;
    ids: string[];
    items: IObject<IJoiningMember>;
  };

  actions: {
    deleteRemoveGroupMember: (payload: { groupId: string; userId: string }) => void;
    getGroupMembers: (payload: IGroupGetMembers) => void;
    clearGroupMembers: () => void;
    updateGroupJoinSetting: (payload: { groupId: string; isJoinApproval: boolean }) => void;

    setGroupMemberRequests: (payload: IPayloadSetGroupMemberRequests) => void;
    resetGroupMemberRequests: () => void;
    storeUndoGroupMemberRequests: () => void;
    undoDeclinedGroupMemberRequests: () => void;
    resetUndoGroupMemberRequests: () => void;
    editGroupMemberRequest: (payload: {id: string, data: any}) => void;

    getGroupMemberRequests: (payload: IPayloadGetGroupMemberRequests) => void;
    approveAllGroupMemberRequests: (payload: IPayloadApproveAllGroupMemberRequests) => void;
    approveSingleGroupMemberRequest: (payload: IPayloadApproveSingleGroupMemberRequest) => void;
    declineAllGroupMemberRequests: (payload: IPayloadDeclineAllGroupMemberRequests) => void;
    declineSingleGroupMemberRequest: (payload: IPayloadDeclineSingleGroupMemberRequest) => void;

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
  groupMemberRequests: {
    total: 0,
    loading: true,
    canLoadMore: true,
    ids: [],
    items: {},
  },
  undoGroupMemberRequests: {
    total: 0,
    loading: null,
    canLoadMore: null,
    ids: [],
    items: {},
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

    setGroupMemberRequests: (payload: IPayloadSetGroupMemberRequests) => {
      set((state: IGroupMemberState) => {
        state.groupMemberRequests = {
          ...state.groupMemberRequests,
          ...payload,
        };
      }, 'setGroupMemberRequests');
    },
    resetGroupMemberRequests: () => {
      set((state: IGroupMemberState) => {
        state.groupMemberRequests = initialState.groupMemberRequests;
      }, 'resetGroupMemberRequests');
    },
    storeUndoGroupMemberRequests: () => {
      set((state: IGroupMemberState) => {
        state.undoGroupMemberRequests = {
          ...state.groupMemberRequests,
        };
      }, 'storeUndoGroupMemberRequests');
    },
    undoDeclinedGroupMemberRequests: () => {
      set((state: IGroupMemberState) => {
        state.groupMemberRequests = {
          ...state.undoGroupMemberRequests,
        };
        state.undoGroupMemberRequests = {
          ...initialState.undoGroupMemberRequests,
        };
      }, 'undoDeclinedGroupMemberRequests');
    },
    resetUndoGroupMemberRequests: () => {
      set((state: IGroupMemberState) => {
        state.undoGroupMemberRequests = initialState.undoGroupMemberRequests;
      }, 'resetUndoGroupMemberRequests');
    },
    editGroupMemberRequest: ({ id, data }) => {
      const { groupMemberRequests }: IGroupMemberState = get();
      set((state: IGroupMemberState) => {
        state.groupMemberRequests.items[id] = {
          ...groupMemberRequests.items[id],
          ...data,
        };
      }, 'editGroupMemberRequest');
    },

    getGroupMemberRequests: getGroupMemberRequests(get),
    approveAllGroupMemberRequests: approveAllGroupMemberRequests(get),
    approveSingleGroupMemberRequest: approveSingleGroupMemberRequest(get),
    declineAllGroupMemberRequests: declineAllGroupMemberRequests(get),
    declineSingleGroupMemberRequest: declineSingleGroupMemberRequest(get),

    assignGroupAdmin: assignGroupAdmin(set, get),
    revokeGroupAdmin: revokeGroupAdmin(set, get),
  },
});

const useGroupMemberStore = createStore<IGroupMemberState>(groupMemberStore);

export default useGroupMemberStore;
