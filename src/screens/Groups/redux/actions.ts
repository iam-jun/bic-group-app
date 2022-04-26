import groupsTypes from '~/screens/Groups/redux/types';
import {
  IGroup,
  IGroupDetail,
  IGroupDetailEdit,
  IGroupImageUpload,
  IGroupAddMembers,
  IGroupGetJoinableMembers,
  IGroupGetMembers,
  IGroupSearchPayload,
  IGroupSetAdmin,
  IGroupRemoveAdmin,
  IJoiningMember,
  IGetCommunityGroup,
} from '~/interfaces/IGroup';
import {IUser} from '~/interfaces/IAuth';
import {IObject} from '~/interfaces/common';

const groupsActions = {
  setPrivacyModalOpen: (payload: boolean) => {
    return {
      type: groupsTypes.SET_PRIVACY_MODAL_OPEN,
      payload,
    };
  },

  getJoinedGroups: function (payload?: any) {
    return {
      type: groupsTypes.GET_JOINED_GROUPS,
      payload,
    };
  },
  setJoinedGroups: function (payload: IGroup[]) {
    return {
      type: groupsTypes.SET_JOINED_GROUPS,
      payload,
    };
  },

  setLoadingGroupMembers: (payload: boolean) => ({
    type: groupsTypes.SET_LOADING_GROUP_MEMBER,
    payload,
  }),
  clearGroupMembers: function () {
    return {
      type: groupsTypes.CLEAR_GROUP_MEMBER,
    };
  },
  setGroupMembers: function (payload: any) {
    return {
      type: groupsTypes.SET_GROUP_MEMBER,
      payload,
    };
  },
  getGroupMembers: function (payload: IGroupGetMembers) {
    return {
      type: groupsTypes.GET_GROUP_MEMBER,
      payload,
    };
  },
  setGroupDetail: function (payload: IGroupDetail | null) {
    return {
      type: groupsTypes.SET_GROUP_DETAIL,
      payload,
    };
  },

  getGroupPosts: (payload: string | number) => {
    return {
      type: groupsTypes.GET_GROUP_POSTS,
      payload,
    };
  },
  setGroupPosts: function (payload: IGroup[]) {
    return {
      type: groupsTypes.SET_GROUP_POSTS,
      payload,
    };
  },
  setExtraGroupPosts: (payload: IGroup[]) => ({
    type: groupsTypes.SET_EXTRA_GROUP_POSTS,
    payload,
  }),
  mergeExtraGroupPosts: (payload: string) => ({
    type: groupsTypes.MERGE_EXTRA_GROUP_POSTS,
    payload,
  }),

  clearGroupPosts: () => ({
    type: groupsTypes.CLEAR_GROUP_POSTS,
  }),

  selectJoinableUsers: (payload: IUser) => ({
    type: groupsTypes.SELECT_JOINABLE_USERS,
    payload,
  }),
  getJoinableUsers: (payload: IGroupGetJoinableMembers) => ({
    type: groupsTypes.GET_JOINABLE_USERS,
    payload,
  }),
  setJoinableUsers: (payload: IUser[]) => ({
    type: groupsTypes.SET_JOINABLE_USERS,
    payload,
  }),
  setExtraJoinableUsers: (payload: IUser[]) => ({
    type: groupsTypes.SET_EXTRA_JOINABLE_USERS,
    payload,
  }),
  mergeExtraJoinableUsers: () => ({
    type: groupsTypes.MERGE_EXTRA_JOINABLE_USERS,
  }),
  resetJoinableUsers: () => ({
    type: groupsTypes.RESET_JOINABLE_USERS,
  }),
  clearSelectedUsers: () => ({
    type: groupsTypes.CLEAR_SELECTED_USERS,
  }),
  setAddMembersMessage: (payload: number) => ({
    type: groupsTypes.SET_ADD_MEMBERS_MESSAGE,
    payload,
  }),
  clearAddMembersMessage: () => ({
    type: groupsTypes.CLEAR_ADD_MEMBERS_MESSAGE,
  }),

  getGroupDetail: function (payload: number, loadingPage = false) {
    return {
      type: groupsTypes.GET_GROUP_DETAIL,
      payload,
      loadingPage,
    };
  },

  editGroupDetail: function (payload: {
    data: IGroupDetailEdit;
    editFieldName?: string;
    callback?: () => void;
  }) {
    return {
      type: groupsTypes.EDIT_GROUP_DETAIL,
      payload,
    };
  },
  uploadImage: function (payload: IGroupImageUpload) {
    return {
      type: groupsTypes.UPLOAD_IMAGE,
      payload,
    };
  },
  addMembers: function (payload: IGroupAddMembers) {
    return {
      type: groupsTypes.ADD_MEMBERS,
      payload,
    };
  },

  setGroupAdmin: (payload: IGroupSetAdmin) => ({
    type: groupsTypes.SET_GROUP_ADMIN,
    payload,
  }),
  removeGroupAdmin: (payload: IGroupRemoveAdmin) => ({
    type: groupsTypes.REMOVE_GROUP_ADMIN,
    payload,
  }),

  joinNewGroup: function (payload: {groupId: number; groupName: string}) {
    return {
      type: groupsTypes.JOIN_NEW_GROUP,
      payload,
    };
  },
  cancelJoinGroup: (payload: {groupId: number; groupName: string}) => ({
    type: groupsTypes.CANCEL_JOIN_GROUP,
    payload,
  }),
  leaveGroup: (payload: number) => ({
    type: groupsTypes.LEAVE_GROUP,
    payload,
  }),

  setLoadingAvatar: (payload: boolean) => ({
    type: groupsTypes.SET_LOADING_AVATAR,
    payload,
  }),
  setLoadingCover: (payload: boolean) => ({
    type: groupsTypes.SET_LOADING_COVER,
    payload,
  }),
  setLoadingPage: (payload: boolean) => ({
    type: groupsTypes.SET_LOADING_PAGE,
    payload,
  }),
  setGroupSearch: (payload: IGroupSearchPayload) => ({
    type: groupsTypes.SET_GROUP_SEARCH,
    payload,
  }),
  getGroupSearch: (payload: string) => ({
    type: groupsTypes.GET_GROUP_SEARCH,
    payload,
  }),

  removeMember: (payload: {
    groupId: number;
    userId: number;
    userFullname: string;
  }) => ({
    type: groupsTypes.REMOVE_MEMBER,
    payload,
  }),

  getMemberRequests: (payload: {groupId: number; params?: any}) => ({
    type: groupsTypes.GET_MEMBER_REQUESTS,
    payload,
  }),
  setMemberRequests: (payload: {
    requestIds: number[];
    requestItems: IObject<IJoiningMember>;
  }) => ({
    type: groupsTypes.SET_MEMBER_REQUESTS,
    payload,
  }),
  resetMemberRequests: () => ({
    type: groupsTypes.RESET_MEMBER_REQUESTS,
  }),
  removeSingleMemberRequest: (payload: {requestId: number}) => ({
    type: groupsTypes.REMOVE_SINGLE_MEMBER_REQUEST,
    payload,
  }),
  undoDeclineMemberRequests: () => ({
    type: groupsTypes.UNDO_DECLINE_MEMBER_REQUESTS,
  }),
  removeAllMemberRequests: () => ({
    type: groupsTypes.REMOVE_ALL_MEMBER_REQUESTS,
  }),
  approveSingleMemberRequest: (payload: {
    groupId: number;
    requestId: number;
    fullName: string;
    callback: () => void;
  }) => ({
    type: groupsTypes.APPROVE_SINGLE_MEMBER_REQUEST,
    payload,
  }),
  approveAllMemberRequests: (payload: {
    groupId: number;
    total: number;
    callback?: () => void;
  }) => ({
    type: groupsTypes.APPROVE_ALL_MEMBER_REQUESTS,
    payload,
  }),
  declineSingleMemberRequest: (payload: {
    groupId: number;
    requestId: number;
    fullName: string;
  }) => ({
    type: groupsTypes.DECLINE_SINGLE_MEMBER_REQUEST,
    payload,
  }),
  declineAllMemberRequests: (payload: {
    groupId: number;
    total: number;
    callback?: () => void;
  }) => ({
    type: groupsTypes.DECLINE_ALL_MEMBER_REQUESTS,
    payload,
  }),
  storeUndoData: () => ({
    type: groupsTypes.STORE_UNDO_DATA,
  }),
  getMyCommunities: () => ({type: groupsTypes.GET_COMMUNITIES}),
  setMyCommunities: (payload: any) => ({
    type: groupsTypes.SET_COMMUNITIES,
    payload,
  }),
  getCommunityGroups: (payload: {id: number; params?: IGetCommunityGroup}) => ({
    type: groupsTypes.GET_COMMUNITY_GROUPS,
    payload,
  }),
  setCommunityGroups: (payload: any[]) => ({
    type: groupsTypes.SET_COMMUNITY_GROUPS,
    payload,
  }),
};

export default groupsActions;
