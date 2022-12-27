import groupsTypes from '~/storeRedux/groups/types';
import {
  IGroup,
  IGroupDetail,
  IGroupImageUpload,
  IGroupAddMembers,
  IGroupGetJoinableMembers,
  IGroupGetMembers,
  IJoiningMember,
  IGroupMembers,
} from '~/interfaces/IGroup';
import { IUser } from '~/interfaces/IAuth';
import { IObject } from '~/interfaces/common';
import {
  IParamGetCommunityMembers,
  ISetMembers,
  ISetCommunitySearchMembers, IParamGetDiscoverGroups,
} from '~/interfaces/ICommunity';

const groupsActions = {
  getGroupSearchMembers: (payload: IGroupGetMembers) => ({
    type: groupsTypes.GET_GROUP_SEARCH_MEMBERS,
    payload,
  }),
  setGroupSearchMembers: (payload: {
    loading?: boolean;
    canLoadMore?: boolean;
    data?: IGroupMembers[];
  }) => ({
    type: groupsTypes.SET_GROUP_SEARCH_MEMBERS,
    payload,
  }),
  clearGroupSearchMembers: () => ({
    type: groupsTypes.CLEAR_GROUP_SEARCH_MEMBERS,
  }),

  getGroupDetail: (payload: {groupId: string; loadingPage?: boolean}) => ({
    type: groupsTypes.GET_GROUP_DETAIL,
    payload,
  }),
  setGroupDetail: (payload: IGroupDetail | null) => ({
    type: groupsTypes.SET_GROUP_DETAIL,
    payload,
  }),
  setGroupDetailError: (payload: boolean) => ({
    type: groupsTypes.SET_GROUP_DETAIL_ERROR,
    payload,
  }),
  selectJoinableUsers: (payload: IUser) => ({
    type: groupsTypes.SELECT_JOINABLE_USERS,
    payload,
  }),
  getJoinableUsers: (payload: IGroupGetJoinableMembers) => ({
    type: groupsTypes.GET_JOINABLE_USERS,
    payload,
  }),
  setJoinableUsers: (payload: {
    loading?: boolean;
    data?: IUser[];
    canLoadMore?: boolean;
    params?: any,
  }) => ({
    type: groupsTypes.SET_JOINABLE_USERS,
    payload,
  }),
  setExtraJoinableUsers: (payload: {
    extra?: IUser[];
    canLoadMore?: boolean;
  }) => ({
    type: groupsTypes.SET_EXTRA_JOINABLE_USERS,
    payload,
  }),
  mergeExtraJoinableUsers: () => ({
    type: groupsTypes.MERGE_EXTRA_JOINABLE_USERS,
  }),
  setMergeExtraJoinableUsers: (payload: {
    data: IUser[],
    extra: IUser[],
  }) => ({
    type: groupsTypes.SET_MERGE_EXTRA_JOINABLE_USERS,
    payload,
  }),
  resetJoinableUsers: () => ({
    type: groupsTypes.RESET_JOINABLE_USERS,
  }),
  clearSelectedUsers: () => ({
    type: groupsTypes.CLEAR_SELECTED_USERS,
  }),
  uploadImage: (payload: IGroupImageUpload) => ({
    type: groupsTypes.UPLOAD_IMAGE,
    payload,
  }),
  addMembers: (payload: IGroupAddMembers) => ({
    type: groupsTypes.ADD_MEMBERS,
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

  getGroupMemberRequests: (payload: {
    groupId: string;
    isRefreshing?: boolean;
    params?: any;
  }) => ({
    type: groupsTypes.GET_GROUP_MEMBER_REQUESTS,
    payload,
  }),
  setGroupMemberRequests: (payload: {
    total?: number;
    loading?: boolean;
    canLoadMore?: boolean;
    ids?: string[];
    items?: IObject<IJoiningMember>;
  }) => ({
    type: groupsTypes.SET_GROUP_MEMBER_REQUESTS,
    payload,
  }),
  resetGroupMemberRequests: () => ({
    type: groupsTypes.RESET_GROUP_MEMBER_REQUESTS,
  }),
  undoDeclinedGroupMemberRequests: () => ({
    type: groupsTypes.UNDO_DECLINED_GROUP_MEMBER_REQUESTS,
  }),
  approveSingleGroupMemberRequest: (payload: {
    groupId: string;
    requestId: string;
    fullName: string;
  }) => ({
    type: groupsTypes.APPROVE_SINGLE_GROUP_MEMBER_REQUEST,
    payload,
  }),
  approveAllGroupMemberRequests: (payload: {
    groupId: string;
    total: number;
    callback?: () => void;
  }) => ({
    type: groupsTypes.APPROVE_ALL_GROUP_MEMBER_REQUESTS,
    payload,
  }),
  declineSingleGroupMemberRequest: (payload: {
    groupId: string;
    requestId: string;
    fullName: string;
  }) => ({
    type: groupsTypes.DECLINE_SINGLE_GROUP_MEMBER_REQUEST,
    payload,
  }),
  declineAllGroupMemberRequests: (payload: {
    groupId: string;
    total: number;
    callback?: () => void;
  }) => ({
    type: groupsTypes.DECLINE_ALL_GROUP_MEMBER_REQUESTS,
    payload,
  }),
  storeUndoGroupMemberRequests: () => ({
    type: groupsTypes.STORE_UNDO_GROUP_MEMBER_REQUESTS,
  }),
  editGroupMemberRequest: (payload: {id: string; data: any}) => ({
    type: groupsTypes.EDIT_GROUP_MEMBER_REQUEST,
    payload,
  }),

  // community
  getCommunityMembers: (payload: {
    groupId: string;
    isRefreshing?: boolean;
    params?: IParamGetCommunityMembers;
  }) => ({
    type: groupsTypes.GET_COMMUNITY_MEMBERS,
    payload,
  }),
  setCommunityMembers: (payload: ISetMembers) => ({
    type: groupsTypes.SET_COMMUNITY_MEMBERS,
    payload,
  }),
  resetCommunityMembers: () => ({
    type: groupsTypes.RESET_COMMUNITY_MEMBERS,
  }),
  getCommunitySearchMembers: (payload: {
    groupId: string;
    params: IParamGetCommunityMembers;
  }) => ({
    type: groupsTypes.GET_COMMUNITY_SEARCH_MEMBERS,
    payload,
  }),
  setCommunitySearchMembers: (payload: ISetCommunitySearchMembers) => ({
    type: groupsTypes.SET_COMMUNITY_SEARCH_MEMBERS,
    payload,
  }),
  resetCommunitySearchMembers: () => ({
    type: groupsTypes.RESET_COMMUNITY_SEARCH_MEMBERS,
  }),
  getDiscoverGroups: (payload: {
    communityId: string;
    isRefreshing?: boolean;
    params?: IParamGetDiscoverGroups;
  }) => ({
    type: groupsTypes.GET_DISCOVER_GROUPS,
    payload,
  }),
  setDiscoverGroups: (payload: {
    loading?: boolean;
    canLoadMore?: boolean;
    ids?: string[];
    items?: IObject<IGroup>;
  }) => ({
    type: groupsTypes.SET_DISCOVER_GROUPS,
    payload,
  }),
  editDiscoverGroupItem: (payload: {id: string; data: any}) => ({
    type: groupsTypes.EDIT_DISCOVER_GROUP_ITEM,
    payload,
  }),
  joinCommunity: (payload: {communityId: string; communityName: string}) => ({
    type: groupsTypes.JOIN_COMMUNITY,
    payload,
  }),
  cancelJoinCommunity: (payload: {
    communityId: string;
    communityName: string;
  }) => ({
    type: groupsTypes.CANCEL_JOIN_COMMUNITY,
    payload,
  }),
  editDiscoverCommunityItem: (payload: {id: string; data: any}) => ({
    type: groupsTypes.EDIT_DISCOVER_COMMUNITY_ITEM,
    payload,
  }),
  getCommunityMemberRequests: (payload: {
    groupId: string;
    isRefreshing?: boolean;
    params?: any;
  }) => ({
    type: groupsTypes.GET_COMMUNITY_MEMBER_REQUESTS,
    payload,
  }),
  setCommunityMemberRequests: (payload: {
    total?: number;
    loading?: boolean;
    canLoadMore?: boolean;
    ids?: string[];
    items?: IObject<IJoiningMember>;
  }) => ({
    type: groupsTypes.SET_COMMUNITY_MEMBER_REQUESTS,
    payload,
  }),
  resetCommunityMemberRequests: () => ({
    type: groupsTypes.RESET_COMMUNITY_MEMBER_REQUESTS,
  }),
  approveSingleCommunityMemberRequest: (payload: {
    communityId: string;
    groupId: string;
    requestId: string;
    fullName: string;
  }) => ({
    type: groupsTypes.APPROVE_SINGLE_COMMUNITY_MEMBER_REQUEST,
    payload,
  }),
  declineSingleCommunityMemberRequest: (payload: {
    groupId: string;
    requestId: string;
    fullName: string;
  }) => ({
    type: groupsTypes.DECLINE_SINGLE_COMMUNITY_MEMBER_REQUEST,
    payload,
  }),
  approveAllCommunityMemberRequests: (payload: {
    communityId: string;
    groupId: string;
    total: number;
  }) => ({
    type: groupsTypes.APPROVE_ALL_COMMUNITY_MEMBER_REQUESTS,
    payload,
  }),
  declineAllCommunityMemberRequests: (payload: {
    groupId: string;
    total: number;
  }) => ({
    type: groupsTypes.DECLINE_ALL_COMMUNITY_MEMBER_REQUESTS,
    payload,
  }),
  storeUndoCommunityMemberRequests: () => ({
    type: groupsTypes.STORE_UNDO_COMMUNITY_MEMBER_REQUESTS,
  }),
  undoDeclinedCommunityMemberRequests: () => ({
    type: groupsTypes.UNDO_DECLINED_COMMUNITY_MEMBER_REQUESTS,
  }),
  editCommunityMemberRequest: (payload: {id: string; data: any}) => ({
    type: groupsTypes.EDIT_COMMUNITY_MEMBER_REQUEST,
    payload,
  }),
  getGlobalSearch: (payload: string) => ({
    type: groupsTypes.GET_GLOBAL_SEARCH,
    payload,
  }),
  setGlobalSearch: (payload: {
    loading?: boolean;
    canLoadMore?: boolean;
    ids?: string[];
    items?: any;
  }) => ({
    type: groupsTypes.SET_GLOBAL_SEARCH,
    payload,
  }),
  resetGlobalSearch: () => ({
    type: groupsTypes.RESET_GLOBAL_SEARCH,
  }),
};

export default groupsActions;
