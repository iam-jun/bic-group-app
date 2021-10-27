import groupsTypes from '~/screens/Groups/redux/types';
import {
  IGroup,
  IGroupDetail,
  IGroupDetailEdit,
  IPayloadGetGroupPost,
  IGroupImageUpload,
  IGroupAddMembers,
  IGroupGetJoinableMembers,
  IGroupGetMembers,
  IGroupSearchPayload,
} from '~/interfaces/IGroup';
import {IUser} from '~/interfaces/IAuth';

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

  getGroupPosts: (payload: IPayloadGetGroupPost) => {
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
  mergeExtraGroupPosts: (payload: IPayloadGetGroupPost) => ({
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

  getGroupDetail: function (payload: number) {
    return {
      type: groupsTypes.GET_GROUP_DETAIL,
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
  addMembers: function (payload: IGroupAddMembers) {
    return {
      type: groupsTypes.ADD_MEMBERS,
      payload,
    };
  },

  joinNewGroup: function (payload: {groupId: number}) {
    return {
      type: groupsTypes.JOIN_NEW_GROUP,
      payload,
    };
  },

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
    userId: string;
    userFullname: string;
  }) => ({
    type: groupsTypes.REMOVE_MEMBER,
    payload,
  }),
};

export default groupsActions;
