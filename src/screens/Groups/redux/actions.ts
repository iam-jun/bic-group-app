import groupsTypes from '~/screens/Groups/redux/types';
import {
  IGroup,
  IGroupDetail,
  IGroupDetailEdit,
  IPayloadGetGroupPost,
  IGroupImageUpload,
} from '~/interfaces/IGroup';
import {IUser} from '~/interfaces/IAuth';

const groupsActions = {
  setPrivacyModalOpen: (payload: boolean) => {
    return {
      type: groupsTypes.SET_PRIVACY_MODAL_OPEN,
      payload,
    };
  },
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
  getGroupMembers: function (payload: number) {
    return {
      type: groupsTypes.GET_GROUP_MEMBER,
      payload,
    };
  },
  setGroupDetail: function (payload: IGroupDetail) {
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
  selectUser: (payload: IUser) => ({
    type: groupsTypes.SELECT_USER,
    payload,
  }),
  clearSelectedUsers: () => ({
    type: groupsTypes.CLEAR_SELECTED_USERS,
  }),
  getUser: () => ({
    type: groupsTypes.GET_USERS,
  }),
  setUser: (payload: IUser[]) => ({
    type: groupsTypes.SET_USERS,
    payload,
  }),
  resetUser: () => ({
    type: groupsTypes.RESET_USERS,
  }),

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
  getGroupPosts: function (payload: IPayloadGetGroupPost) {
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
  uploadImage: function (payload: IGroupImageUpload) {
    return {
      type: groupsTypes.UPLOAD_IMAGE,
      payload,
    };
  },
};

export default groupsActions;
