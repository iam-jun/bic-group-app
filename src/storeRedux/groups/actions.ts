import groupsTypes from '~/storeRedux/groups/types';
import {
  IGroup,
  IGroupDetail,
  IGroupDetailEdit,
  IGroupImageUpload,
  IGroupAddMembers,
  IGroupGetJoinableMembers,
  IGroupGetMembers,
  IGroupSetAdmin,
  IGroupRemoveAdmin,
  IJoiningMember,
  IGetCommunityGroup,
  IGetYourGroupsSearch,
  IStateSearch,
  IStateList,
  IGroupMembers,
  IPermission,
  IScheme,
  IPayloadGroupSchemeAssignments,
  IGetJoinedAllGroups,
  SetJoinedAllGroupsPayload,
  SetManagedPayload,
  IGetManagedPayload,
  IGetManagedCommunityAndGroupPayload,
} from '~/interfaces/IGroup';
import { IUser } from '~/interfaces/IAuth';
import { IObject } from '~/interfaces/common';
import {
  ICommunity,
  IParamGetCommunityMembers,
  ISetMembers,
  ISetCommunitySearchMembers,
  IParamGetCommunities,
  ICommunityDetailEdit,
} from '~/interfaces/ICommunity';

const groupsActions = {
  updateCommunityJoinSetting: (payload: {communityId: string; isJoinApproval: boolean}) => ({
    type: groupsTypes.UPDATE_COMMUNITY_JOIN_SETTING,
    payload,
  }),
  updateGroupJoinSetting: (payload: {groupId: string; isJoinApproval: boolean}) => ({
    type: groupsTypes.UPDATE_GROUP_JOIN_SETTING,
    payload,
  }),

  getMyPermissions: () => ({
    type: groupsTypes.GET_MY_PERMISSIONS,
  }),
  setMyPermissions: (payload: any) => ({
    type: groupsTypes.SET_MY_PERMISSIONS,
    payload,
  }),

  // group structure settings
  setGroupStructure: (payload?: any) => ({
    type: groupsTypes.SET_GROUP_STRUCTURE,
    payload,
  }),
  getGroupStructureCommunityTree: (payload: {
    communityId: string;
    showLoading?: boolean;
  }) => ({
    type: groupsTypes.GET_GROUP_STRUCTURE_COMMUNITY_TREE,
    payload,
  }),
  setGroupStructureCommunityTree: (payload?: any) => ({
    type: groupsTypes.SET_GROUP_STRUCTURE_COMMUNITY_TREE,
    payload,
  }),
  setGroupStructureReorder: (payload?: any) => ({
    type: groupsTypes.SET_GROUP_STRUCTURE_REORDER,
    payload,
  }),
  putGroupStructureReorder: (payload: {
    communityId: string;
    newOrder: number[];
  }) => ({
    type: groupsTypes.PUT_GROUP_STRUCTURE_REORDER,
    payload,
  }),
  setGroupStructureMove: (payload?: {
    loading?: boolean;
    targetGroups?: any[];
    movingGroup?: any;
    key?: string;
  }) => ({
    type: groupsTypes.SET_GROUP_STRUCTURE_MOVE,
    payload,
  }),
  getGroupStructureMoveTargets: (payload?: {
    communityId: string;
    groupId: string;
    key?: string;
  }) => ({
    type: groupsTypes.GET_GROUP_STRUCTURE_MOVE_TARGETS,
    payload,
  }),
  putGroupStructureMoveToTarget: (payload: {
    communityId: string;
    moveId: string;
    targetId: string;
  }) => ({
    type: groupsTypes.PUT_GROUP_STRUCTURE_MOVE_TO_TARGET,
    payload,
  }),
  setGroupStructureMoveSelecting: (payload?: any) => ({
    type: groupsTypes.SET_GROUP_STRUCTURE_MOVE_SELECTING,
    payload,
  }),
  putGroupStructureCollapseStatus: (payload: {
    communityId: string;
    groupId: string;
    isCollapse: boolean;
  }) => ({
    type: groupsTypes.PUT_GROUP_STRUCTURE_COLLAPSE_STATUS,
    payload,
  }),
  // permission
  getPermissionCategories: (payload?: 'SYSTEM' | 'COMMUNITY' | 'GROUP') => ({
    type: groupsTypes.GET_PERMISSION_CATEGORIES,
    payload,
  }),
  setPermissionCategories: (payload: any) => ({
    type: groupsTypes.SET_PERMISSION_CATEGORIES,
    payload,
  }),
  getSystemScheme: () => ({
    type: groupsTypes.GET_SYSTEM_SCHEME,
  }),
  setSystemScheme: (payload: any) => ({
    type: groupsTypes.SET_SYSTEM_SCHEME,
    payload,
  }),
  setCreatingScheme: (payload?: any) => ({
    type: groupsTypes.SET_CREATING_SCHEME,
    payload,
  }),
  setCreatingSchemeData: (payload?: any) => ({
    type: groupsTypes.SET_CREATING_SCHEME_DATA,
    payload,
  }),
  updateCreatingSchemePermission: (payload?: {
    permission: IPermission;
    roleIndex: number;
  }) => ({
    type: groupsTypes.UPDATE_CREATING_SCHEME_PERMISSION,
    payload,
  }),
  postCreateSchemePermission: (payload?: {communityId: string}) => ({
    type: groupsTypes.POST_CREATE_SCHEME_PERMISSION,
    payload,
  }),
  getCommunityScheme: (payload?: {communityId: string}) => ({
    type: groupsTypes.GET_COMMUNITY_SCHEME,
    payload,
  }),
  setCommunityScheme: (payload?: {
    loading?: boolean;
    data?: IScheme;
    deleting?: boolean;
  }) => ({
    type: groupsTypes.SET_COMMUNITY_SCHEME,
    payload,
  }),
  updateCommunityScheme: (payload?: {communityId: string}) => ({
    type: groupsTypes.UPDATE_COMMUNITY_SCHEME,
    payload,
  }),
  deleteCommunityScheme: (payload?: {communityId: string}) => ({
    type: groupsTypes.DELETE_COMMUNITY_SCHEME,
    payload,
  }),
  getSchemes: (payload?: {communityId: string; isRefreshing?: boolean}) => ({
    type: groupsTypes.GET_SCHEMES,
    payload,
  }),
  setSchemes: (payload?: {
    loading?: boolean;
    data?: any;
    allSchemes?: any;
  }) => ({
    type: groupsTypes.SET_SCHEMES,
    payload,
  }),
  getGroupScheme: (payload: {communityId: string; schemeId: string}) => ({
    type: groupsTypes.GET_GROUP_SCHEME,
    payload,
  }),
  setGroupScheme: (payload?: {data?: IScheme}) => ({
    type: groupsTypes.SET_GROUP_SCHEME,
    payload,
  }),
  getGroupSchemeAssignments: (payload: {
    communityId: string;
    showLoading?: boolean;
  }) => ({
    type: groupsTypes.GET_GROUP_SCHEME_ASSIGNMENTS,
    payload,
  }),
  setGroupSchemeAssignments: (payload?: any) => ({
    type: groupsTypes.SET_GROUP_SCHEME_ASSIGNMENTS,
    payload,
  }),
  setGroupSchemeAssigning: (payload?: {
    data?: any;
    loading?: boolean;
    currentAssignments?: any;
  }) => ({
    type: groupsTypes.SET_GROUP_SCHEME_ASSIGNING,
    payload,
  }),
  putGroupSchemeAssignments: (payload: IPayloadGroupSchemeAssignments) => ({
    type: groupsTypes.PUT_GROUP_SCHEME_ASSIGNMENTS,
    payload,
  }),
  updateGroupScheme: (payload: {communityId: string; schemeId: string}) => ({
    type: groupsTypes.UPDATE_GROUP_SCHEME,
    payload,
  }),

  clearGroupMembers: () => ({
    type: groupsTypes.CLEAR_GROUP_MEMBER,
  }),
  setGroupMembers: (payload: any) => ({
    type: groupsTypes.SET_GROUP_MEMBER,
    payload,
  }),
  getGroupMembers: (payload: IGroupGetMembers) => ({
    type: groupsTypes.GET_GROUP_MEMBER,
    payload,
  }),

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
  editGroupDetail: (payload: {
    data: IGroupDetailEdit;
    editFieldName?: string;
    callback?: () => void;
  }) => ({
    type: groupsTypes.EDIT_GROUP_DETAIL,
    payload,
  }),

  getGroupPosts: (payload: string) => ({
    type: groupsTypes.GET_GROUP_POSTS,
    payload,
  }),
  setGroupPosts: (payload: IGroup[]) => ({
    type: groupsTypes.SET_GROUP_POSTS,
    payload,
  }),
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

  uploadImage: (payload: IGroupImageUpload) => ({
    type: groupsTypes.UPLOAD_IMAGE,
    payload,
  }),
  addMembers: (payload: IGroupAddMembers) => ({
    type: groupsTypes.ADD_MEMBERS,
    payload,
  }),

  setGroupAdmin: (payload: IGroupSetAdmin) => ({
    type: groupsTypes.SET_GROUP_ADMIN,
    payload,
  }),
  removeGroupAdmin: (payload: IGroupRemoveAdmin) => ({
    type: groupsTypes.REMOVE_GROUP_ADMIN,
    payload,
  }),
  leaveGroup: (payload: string) => ({
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

  removeMember: (payload: {
    groupId: string;
    userId: string;
    userFullname: string;
  }) => ({
    type: groupsTypes.REMOVE_MEMBER,
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
  getMyCommunities: (payload: {
    isRefreshing?: boolean;
    refreshNoLoading?: boolean;
    params?: {managed: boolean; previewMembers: boolean};
    callback?: () => void;
  }) => ({
    type: groupsTypes.GET_JOINED_COMMUNITIES,
    payload,
  }),
  setMyCommunities: (payload: {
    loading?: boolean;
    canLoadMore?: boolean;
    ids?: string[];
    items?: IObject<any>;
  }) => ({
    type: groupsTypes.SET_JOINED_COMMUNITIES,
    payload,
  }),
  getManagedCommunities: (payload: {
    isRefreshing?: boolean;
    refreshNoLoading?: boolean;
    params?: {managed: boolean; previewMembers: boolean};
  }) => ({
    type: groupsTypes.GET_MANAGED_COMMUNITIES,
    payload,
  }),
  setManagedCommunities: (payload: {
    loading?: boolean;
    canLoadMore?: boolean;
    ids?: string[];
    items?: IObject<any>;
  }) => ({
    type: groupsTypes.SET_MANAGED_COMMUNITIES,
    payload,
  }),
  getDiscoverCommunities: (payload: {
    isRefreshing?: boolean;
    refreshNoLoading?: boolean;
  }) => ({
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
  getYourGroupsTree: (payload: string) => ({
    type: groupsTypes.GET_YOUR_GROUPS_TREE,
    payload,
  }),
  setYourGroupsTree: (payload: IStateList) => ({
    type: groupsTypes.SET_YOUR_GROUPS_TREE,
    payload,
  }),
  getYourGroupsList: (payload: string) => ({
    type: groupsTypes.GET_YOUR_GROUPS_LIST,
    payload,
  }),
  setYourGroupsList: (payload: IStateList) => ({
    type: groupsTypes.SET_YOUR_GROUPS_LIST,
    payload,
  }),
  getCommunityGroups: (payload: {id: string; params?: IGetCommunityGroup}) => ({
    type: groupsTypes.GET_COMMUNITY_GROUPS,
    payload,
  }),
  setCommunityGroups: (payload: any[]) => ({
    type: groupsTypes.SET_COMMUNITY_GROUPS,
    payload,
  }),
  getCommunityDetail: (payload: {
    communityId: string;
    loadingPage?: boolean;
    showLoading?: boolean;
  }) => ({
    type: groupsTypes.GET_COMMUNITY_DETAIL,
    payload,
  }),
  setCommunityLoading: (payload: boolean) => ({
    type: groupsTypes.SET_COMMUNITY_LOADING,
    payload,
  }),
  setCommunityError: (payload: boolean) => ({
    type: groupsTypes.SET_COMMUNITY_ERROR,
    payload,
  }),
  setCommunityDetail: (payload: ICommunity) => ({
    type: groupsTypes.SET_COMMUNITY_DETAIL,
    payload,
  }),
  getCommunityMembers: (payload: {
    communityId: string;
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
    communityId: string;
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
    communityId: string;
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
    requestId: string;
    fullName: string;
  }) => ({
    type: groupsTypes.APPROVE_SINGLE_COMMUNITY_MEMBER_REQUEST,
    payload,
  }),
  declineSingleCommunityMemberRequest: (payload: {
    communityId: string;
    requestId: string;
    fullName: string;
  }) => ({
    type: groupsTypes.DECLINE_SINGLE_COMMUNITY_MEMBER_REQUEST,
    payload,
  }),
  approveAllCommunityMemberRequests: (payload: {
    communityId: string;
    total: number;
    callback?: () => void;
  }) => ({
    type: groupsTypes.APPROVE_ALL_COMMUNITY_MEMBER_REQUESTS,
    payload,
  }),
  declineAllCommunityMemberRequests: (payload: {
    communityId: string;
    total: number;
    callback?: () => void;
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

  getCommunitySearch: (payload: IParamGetCommunities) => ({
    type: groupsTypes.GET_COMMUNITY_SEARCH,
    payload,
  }),
  setCommunitySearch: (payload: {
    loading?: boolean;
    canLoadMore?: boolean;
    ids?: string[];
    items?: any;
  }) => ({
    type: groupsTypes.SET_COMMUNITY_SEARCH,
    payload,
  }),
  resetCommunitySearch: () => ({
    type: groupsTypes.RESET_COMMUNITY_SEARCH,
  }),
  editCommunityDetail: (payload: {
    data: ICommunityDetailEdit;
    editFieldName?: string;
    callback?: () => void;
  }) => ({
    type: groupsTypes.EDIT_COMMUNITY_DETAIL,
    payload,
  }),
  getJoinedAllGroups: (payload: IGetJoinedAllGroups = {}) => ({
    type: groupsTypes.GET_JOINED_ALL_GROUPS,
    payload,
  }),
  setJoinedAllGroups: (payload: SetJoinedAllGroupsPayload) => ({
    type: groupsTypes.SET_JOINED_ALL_GROUPS,
    payload,
  }),
  getManaged: (payload: IGetManagedPayload = {}) => ({
    type: groupsTypes.GET_MANAGED,
    payload,
  }),
  setManaged: (payload: SetManagedPayload) => ({
    type: groupsTypes.SET_MANAGED,
    payload,
  }),
  getOwnerCommunity: () => ({
    type: groupsTypes.GET_OWNER_COMMUNITY,
  }),
  getManagedCommunityAndGroup: (payload: IGetManagedCommunityAndGroupPayload = {}) => ({
    type: groupsTypes.GET_MANAGED_COMMUNITY_AND_GROUP,
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
