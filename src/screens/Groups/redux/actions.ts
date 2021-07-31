import groupsTypes from '~/screens/Groups/redux/types';
import {IGroup, IGroupDetail} from '~/interfaces/IGroup';

const groupsActions = {
  setLoadingJoinedGroups: function (payload: boolean) {
    return {
      type: groupsTypes.SET_LOADING_JOINED_GROUPS,
      payload,
    };
  },
  setJoinedGroups: function (payload: IGroup[]) {
    return {
      type: groupsTypes.SET_JOINED_GROUPS,
      payload,
    };
  },
  setLoadingGroupDetail: function (payload: boolean) {
    return {
      type: groupsTypes.SET_LOADING_GROUP_DETAIL,
      payload,
    };
  },
  setGroupDetail: function (payload: IGroupDetail) {
    return {
      type: groupsTypes.SET_GROUP_DETAIL,
      payload,
    };
  },

  //for saga
  getJoinedGroups: function (payload?: any) {
    return {
      type: groupsTypes.GET_JOINED_GROUPS,
      payload,
    };
  },
  getGroupDetail: function (payload: number) {
    return {
      type: groupsTypes.GET_GROUP_DETAIL,
      payload,
    };
  },
};

export default groupsActions;
