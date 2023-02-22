import groupsTypes from '~/storeRedux/groups/types';
import {
  IGroup,
  IGroupImageUpload,
  IGroupAddMembers,
  IGroupGetJoinableMembers,
} from '~/interfaces/IGroup';
import { IUser } from '~/interfaces/IAuth';
import { IObject } from '~/interfaces/common';
import { IParamGetDiscoverGroups } from '~/interfaces/ICommunity';

const groupsActions = {
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
};

export default groupsActions;
