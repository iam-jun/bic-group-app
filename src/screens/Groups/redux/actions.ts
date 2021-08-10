import groupsTypes from '~/screens/Groups/redux/types';
import {IGroup, IGroupDetailEdit} from '~/interfaces/IGroup';

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
  setGroupDetail: function (payload: IGroup) {
    return {
      type: groupsTypes.SET_GROUP_DETAIL,
      payload,
    };
  },
  setLoadingGroupPosts: function (payload: boolean) {
    return {
      type: groupsTypes.SET_LOADING_GROUP_POSTS,
      payload,
    };
  },
  setGroupPosts: function (payload: IGroup[]) {
    return {
      type: groupsTypes.SET_GROUP_POSTS,
      payload,
    };
  },
  selectGroupDetail: function (payload: IGroup) {
    return {
      type: groupsTypes.SELECT_GROUP_DETAIL,
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
  getGroupPosts: function (payload: number) {
    return {
      type: groupsTypes.GET_GROUP_POSTS,
      payload,
    };
  },
  editGroupDetail: function (payload: IGroupDetailEdit) {
    return {
      type: groupsTypes.EDIT_GROUP_DETAIL,
      payload,
    };
  },
};

export default groupsActions;
