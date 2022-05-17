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
  IGetYourGroupsSearch,
  IStateSearch,
  IStateList,
} from '~/interfaces/IGroup';
import {IUser} from '~/interfaces/IAuth';
import {IObject} from '~/interfaces/common';
import {
  ICommunity,
  ICommunityMembers,
  IParamGetCommunityMembers,
  IParamGetDiscoverGroups,
} from '~/interfaces/ICommunity';

const groupsActions = {
  setPrivacyModalOpen: (payload: boolean) => {
    return {
      type: groupsTypes.SET_PRIVACY_MODAL_OPEN,
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

  // community
  getMyCommunities: (payload: {callback?: () => void}) => ({
    type: groupsTypes.GET_JOINED_COMMUNITIES,
    payload,
  }),
  setMyCommunities: (payload: any) => ({
    type: groupsTypes.SET_JOINED_COMMUNITIES,
    payload,
  }),
  getDiscoverCommunities: (payload: any) => ({
    type: groupsTypes.GET_DISCOVER_COMMUNITIES,
    payload,
  }),
  setDiscoverCommunities: (payload: any) => ({
    type: groupsTypes.SET_DISCOVER_COMMUNITIES,
    payload,
  }),
  getYourGroupsSearch: (payload: IGetYourGroupsSearch) => ({
    type: groupsTypes.GET_YOUR_GROUPS_SEARCH,
    payload,
  }),
  setYourGroupsSearch: (payload: IStateSearch) => ({
    type: groupsTypes.SET_YOUR_GROUPS_SEARCH,
    payload,
  }),
  getYourGroupsTree: (payload: number) => ({
    type: groupsTypes.GET_YOUR_GROUPS_TREE,
    payload,
  }),
  setYourGroupsTree: (payload: IStateList) => ({
    type: groupsTypes.SET_YOUR_GROUPS_TREE,
    payload,
  }),
  getYourGroupsList: (payload: number) => ({
    type: groupsTypes.GET_YOUR_GROUPS_LIST,
    payload,
  }),
  setYourGroupsList: (payload: IStateList) => ({
    type: groupsTypes.SET_YOUR_GROUPS_LIST,
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
  getCommunityDetail: (payload: number, loadingPage = false) => ({
    type: groupsTypes.GET_COMMUNITY_DETAIL,
    payload,
    loadingPage,
  }),
  setCommunityDetail: (payload: ICommunity) => ({
    type: groupsTypes.SET_COMMUNITY_DETAIL,
    payload,
  }),
  getCommunityMembers: (payload: {
    communityId: number;
    params?: IParamGetCommunityMembers;
  }) => ({
    type: groupsTypes.GET_COMMUNITY_MEMBERS,
    payload,
  }),
  setCommunityMembers: (payload: ICommunityMembers[]) => ({
    type: groupsTypes.SET_COMMUNITY_MEMBERS,
    payload,
  }),
  resetCommunityMembers: () => ({
    type: groupsTypes.RESET_COMMUNITY_MEMBERS,
  }),
  getSearchMembers: (payload: {
    communityId: number;
    params: IParamGetCommunityMembers;
  }) => ({
    type: groupsTypes.GET_SEARCH_MEMBERS,
    payload,
  }),
  setSearchMembers: (payload: ICommunityMembers[]) => ({
    type: groupsTypes.SET_SEARCH_MEMBERS,
    payload,
  }),
  resetSearchMembers: () => ({
    type: groupsTypes.RESET_SEARCH_MEMBERS,
  }),
  getDiscoverGroups: (payload: {
    communityId: number;
    params?: IParamGetDiscoverGroups;
  }) => ({
    type: groupsTypes.GET_DISCOVER_GROUPS,
    payload,
  }),
  setDiscoverGroups: (payload: {ids: number[]; items: any}) => ({
    type: groupsTypes.SET_DISCOVER_GROUPS,
    payload,
  }),
  resetDiscoverGroups: () => ({
    type: groupsTypes.RESET_DISCOVER_GROUPS,
  }),
  editDiscoverGroupItem: (payload: {id: number; data: any}) => ({
    type: groupsTypes.EDIT_DISCOVER_GROUP_ITEM,
    payload,
  }),
};

export default groupsActions;
