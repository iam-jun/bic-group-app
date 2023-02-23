import groupsTypes from '~/storeRedux/groups/types';
import {
  IGroup,
  IGroupImageUpload,
} from '~/interfaces/IGroup';
import { IObject } from '~/interfaces/common';
import { IParamGetDiscoverGroups } from '~/interfaces/ICommunity';

const groupsActions = {
  uploadImage: (payload: IGroupImageUpload) => ({
    type: groupsTypes.UPLOAD_IMAGE,
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
