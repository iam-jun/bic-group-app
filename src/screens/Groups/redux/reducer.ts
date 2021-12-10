import appConfig from '~/configs/appConfig';
import groupsTypes from '~/screens/Groups/redux/types';
import {IUser} from '~/interfaces/IAuth';
import {IJoiningMember} from '~/interfaces/IGroup';
import {IObject} from '~/interfaces/common';

const initGroupsState = {
  isPrivacyModalOpen: false,
  loadingJoinedGroups: false,
  joinedGroups: [],

  loadingPage: false,
  loadingGroupDetail: false,
  groupDetail: {
    group: {},
  },
  groupSearch: {
    isShow: false,
    loading: false,
    searchKey: '',
    result: [],
  },
  loadingGroupMember: false,
  groupMember: {
    skip: 0,
    take: 20,
    canLoadMore: true,
    //type admin, member...
  },
  refreshingGroupPosts: false,
  posts: {
    loading: false,
    data: [],
    extra: [],
    offset: 0,
    canLoadMore: true,
  },

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

  pendingMemberRequests: {
    loading: false,
    data: [],
    items: {} as IObject<IJoiningMember>,
    canLoadMore: true,
  },
  // temporarily stores data for `undo` action
  undoData: {
    data: [],
    items: {} as IObject<IJoiningMember>,
  },
};

function groupsReducer(state = initGroupsState, action: any = {}) {
  const {type, payload} = action;
  const {users, selectedUsers, pendingMemberRequests} = state;

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

    case groupsTypes.SET_LOADING_GROUP_MEMBER:
      return {
        ...state,
        loadingGroupMember: payload,
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

    case groupsTypes.GET_GROUP_POSTS:
      return {
        ...state,
        refreshingGroupPosts: true,
        posts: {
          ...state.posts,
          loading: state.posts.data.length === 0,
          params: payload.params,
        },
      };
    case groupsTypes.SET_GROUP_POSTS:
      return {
        ...state,
        refreshingGroupPosts: false,
        posts: {
          ...state.posts,
          loading: false,
          data: payload,
          offset: state.posts.offset + payload.length,
          canLoadMore: payload.length === appConfig.recordsPerPage,
        },
      };
    case groupsTypes.SET_EXTRA_GROUP_POSTS:
      return {
        ...state,
        refreshingGroupPosts: false,
        posts: {
          ...state.posts,
          extra: payload,
          offset: state.posts.offset + payload.length,
          canLoadMore: payload.length === appConfig.recordsPerPage,
        },
      };
    case groupsTypes.MERGE_EXTRA_GROUP_POSTS:
      return {
        ...state,
        posts: {
          ...state.posts,
          data: [...state.posts.data, ...state.posts.extra],
          extra: [],
        },
      };
    case groupsTypes.CLEAR_GROUP_POSTS:
      return {
        ...state,
        posts: initGroupsState.posts,
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
    case groupsTypes.SET_LOADING_PAGE:
      return {
        ...state,
        loadingPage: payload,
      };
    case groupsTypes.SET_GROUP_SEARCH:
      return {
        ...state,
        groupSearch: {
          ...state.groupSearch,
          ...payload,
        },
      };

    // PENDING MEMBER REQUESTS
    case groupsTypes.GET_MEMBER_REQUESTS:
      return {
        ...state,
        pendingMemberRequests: {
          ...pendingMemberRequests,
          loading: pendingMemberRequests.data.length === 0,
          params: payload.params,
        },
      };
    case groupsTypes.SET_MEMBER_REQUESTS:
      return {
        ...state,
        pendingMemberRequests: {
          ...pendingMemberRequests,
          loading: false,
          data: [...pendingMemberRequests.data, ...payload.requestIds],
          items: {
            ...pendingMemberRequests.items,
            ...payload.requestItems,
          },
          canLoadMore: payload.requestIds.length === appConfig.recordsPerPage,
        },
      };
    case groupsTypes.APPROVE_SINGLE_MEMBER_REQUEST:
    case groupsTypes.REMOVE_SINGLE_MEMBER_REQUEST: {
      const requestItems = {...pendingMemberRequests.items};
      delete requestItems[payload];
      return {
        ...state,
        pendingMemberRequests: {
          ...pendingMemberRequests,
          data: pendingMemberRequests.data.filter(
            (item: number) => item !== payload,
          ),
          items: requestItems,
        },
      };
    }
    case groupsTypes.APPROVE_ALL_MEMBER_REQUESTS:
    case groupsTypes.CLEAR_ALL_MEMBER_REQUESTS:
      return {
        ...state,
        pendingMemberRequests: initGroupsState.pendingMemberRequests,
      };
    case groupsTypes.DECLINE_SINGLE_MEMBER_REQUEST:
    case groupsTypes.DECLINE_ALL_MEMBER_REQUESTS:
      return {
        ...state,
        undoData: initGroupsState.undoData,
      };
    case groupsTypes.UNDO_DECLINE_MEMBER_REQUESTS:
      return {
        ...state,
        pendingMemberRequests: {
          ...state.pendingMemberRequests,
          data: state.undoData.data,
          items: state.undoData.items,
        },
        undoData: initGroupsState.undoData,
      };
    case groupsTypes.STORE_UNDO_DATA:
      return {
        ...state,
        undoData: {
          data: payload.requestIds,
          items: payload.requestItems,
        },
      };

    default:
      return state;
  }
}

export default groupsReducer;
