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
