import groupsTypes from '~/screens/Groups/redux/types';
import {IUser} from '~/interfaces/IAuth';

const initGroupsState = {
  isPrivacyModalOpen: false,
  loadingJoinedGroups: false,
  joinedGroups: [],
  loadingGroupDetail: false,
  groupDetail: {
    group: {},
  },
  groupMember: {
    skip: 0,
    take: 20,
    canLoadMore: true,
    //type admin, member...
  },
  loadingGroupPosts: false,
  groupPosts: [],
  refreshingGroupPosts: false,

  users: {
    loading: false,
    data: [],
    extra: [],
    offset: 0,
    canLoadMore: true,
  },
  selectedUsers: new Array<IUser>(),
};

function groupsReducer(state = initGroupsState, action: any = {}) {
  const {type} = action;
  const {users, selectedUsers} = state;

  switch (type) {
    case groupsTypes.SET_PRIVACY_MODAL_OPEN:
      return {
        ...state,
        isPrivacyModalOpen: action.payload,
      };
    case groupsTypes.SET_LOADING_JOINED_GROUPS:
      return {
        ...state,
        loadingJoinedGroups: action.payload,
      };
    case groupsTypes.SET_JOINED_GROUPS:
      return {
        ...state,
        joinedGroups: action.payload || [],
      };
    case groupsTypes.SET_LOADING_GROUP_DETAIL:
      return {
        ...state,
        loadingGroupDetail: action.payload,
      };
    case groupsTypes.SELECT_GROUP_DETAIL:
      return {
        ...state,
        groupDetail: {
          ...state.groupDetail,
          group: action.payload,
        },
      };
    case groupsTypes.SET_GROUP_DETAIL:
      return {
        ...state,
        groupDetail: {
          ...state.groupDetail,
          ...action.payload,
        },
      };
    case groupsTypes.CLEAR_GROUP_MEMBER:
      return {
        ...state,
        groupMember: initGroupsState.groupMember,
      };
    case groupsTypes.SET_GROUP_MEMBER:
      return {
        ...state,
        groupMember: action.payload,
      };
    case groupsTypes.SET_LOADING_GROUP_POSTS:
      return {
        ...state,
        loadingGroupPosts: action.payload,
      };
    case groupsTypes.SET_GROUP_POSTS:
      return {
        ...state,
        groupPosts: action.payload || [],
        refreshingGroupPosts: false,
      };
    case groupsTypes.GET_GROUP_POSTS:
      return {
        ...state,
        refreshingGroupPosts: true,
      };
    case groupsTypes.EDIT_GROUP_DETAIL:
      return {
        ...state,
        groupDetail: {
          ...state.groupDetail,
          group: {
            ...state.groupDetail.group,
            ...action.payload,
          },
        },
      };
    case groupsTypes.SELECT_USER:
      return {
        ...state,
        selectedUsers: !action.payload.selected
          ? [...selectedUsers, {...action.payload, selected: true}]
          : selectedUsers.filter(user => user._id !== action.payload._id),
        users: {
          ...users,
          data: users.data.map((item: IUser) =>
            item._id === action.payload._id
              ? {
                  ...item,
                  selected: !item.selected,
                }
              : item,
          ),
        },
      };
    case groupsTypes.CLEAR_SELECTED_USERS:
      return {
        ...state,
        selectedUsers: [],
      };
    case groupsTypes.SET_USERS:
      return {
        ...state,
        users: {
          ...state.users,
          data: action.payload,
        },
      };
    case groupsTypes.RESET_USERS:
      return {
        ...state,
        users: initGroupsState.users,
      };

    default:
      return state;
  }
}

export default groupsReducer;
