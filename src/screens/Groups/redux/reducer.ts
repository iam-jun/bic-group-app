import appConfig from '~/configs/appConfig';
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

  loadingAvatar: false,
  loadingCover: false,
};

function groupsReducer(state = initGroupsState, action: any = {}) {
  const {type, payload} = action;
  const {users, selectedUsers} = state;

  switch (type) {
    case groupsTypes.SET_PRIVACY_MODAL_OPEN:
      return {
        ...state,
        isPrivacyModalOpen: action.payload,
      };

    case groupsTypes.GET_JOINED_GROUPS:
      return {
        ...state,
        loadingJoinedGroups: true,
        joinedGroups: initGroupsState.joinedGroups,
      };
    case groupsTypes.SET_JOINED_GROUPS:
      return {
        ...state,
        loadingJoinedGroups: false,
        joinedGroups: action.payload || [],
      };

    case groupsTypes.GET_GROUP_DETAIL:
      return {
        ...state,
        loadingGroupDetail: true,
      };
    case groupsTypes.SET_GROUP_DETAIL:
      return {
        ...state,
        loadingCover: false,
        loadingAvatar: false,
        loadingGroupDetail: false,
        groupDetail: {
          group: {}, // init state
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
    case groupsTypes.CLEAR_GROUP_POSTS:
      return {
        ...state,
        groupPosts: initGroupsState.groupPosts,
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

    case groupsTypes.GET_JOINABLE_USERS:
      return {
        ...state,
        users: {
          ...state.users,
          loading: state.users.data.length === 0,
          params: payload.params,
        },
      };
    case groupsTypes.SET_JOINABLE_USERS:
      return {
        ...state,
        users: {
          ...state.users,
          loading: false,
          data: payload,
          offset: state.users.offset + payload.length,
          canLoadMore: payload.length === appConfig.recordsPerPage,
        },
      };
    case groupsTypes.SET_EXTRA_JOINABLE_USERS:
      return {
        ...state,
        users: {
          ...state.users,
          extra: payload,
          offset: state.users.offset + payload.length,
          canLoadMore: payload.length === appConfig.recordsPerPage,
        },
      };
    case groupsTypes.MERGE_EXTRA_JOINABLE_USERS:
      return {
        ...state,
        users: {
          ...state.users,
          data: [...state.users.data, ...state.users.extra],
          extra: [],
        },
      };
    case groupsTypes.SELECT_JOINABLE_USERS:
      return {
        ...state,
        selectedUsers: !payload.selected
          ? [...selectedUsers, {...payload, selected: true}]
          : selectedUsers.filter(user => user.id !== payload.id),
        users: {
          ...users,
          data: users.data.map((item: IUser) =>
            item.id === payload.id
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

    case groupsTypes.RESET_JOINABLE_USERS:
      return {
        ...state,
        users: initGroupsState.users,
      };

    case groupsTypes.SET_LOADING_AVATAR:
      return {
        ...state,
        loadingAvatar: payload,
      };
    case groupsTypes.SET_LOADING_COVER:
      return {
        ...state,
        loadingCover: payload,
      };

    default:
      return state;
  }
}

export default groupsReducer;
