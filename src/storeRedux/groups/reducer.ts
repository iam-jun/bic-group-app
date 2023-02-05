import groupsTypes from '~/storeRedux/groups/types';
import { IUser } from '~/interfaces/IAuth';
import {
  IGroupMembers,
} from '~/interfaces/IGroup';

export const groupInitState = {
  permissionScheme: {
    assignGroupScheme: {
      assignments: {
        loading: false,
        data: undefined,
      },
      assigning: {
        loading: false,
        data: [],
        currentAssignments: undefined,
      },
    },
  },
  groupStructure: {
    communityTree: {
      loading: false,
      data: undefined,
    },
    reorder: {
      newOrder: undefined,
      loading: false,
    },
    move: {
      loading: false,
      searchKey: '',
      targetGroups: undefined,
      movingGroup: undefined,
      selecting: undefined,
    },
  },
  isPrivacyModalOpen: false,
  loadingJoinedGroups: false,
  joinedGroups: [],
  yourGroupsTree: {
    loading: true,
    list: [],
  },
  groupSearchMembers: {
    loading: false,
    canLoadMore: true,
    data: [] as IGroupMembers[],
  },
  users: {
    loading: false,
    data: [],
    extra: [],
    canLoadMore: true,
  },
  selectedUsers: [] as IUser[],

  joinedCommunities: {
    loading: false,
    canLoadMore: true,
    ids: [] as string[],
    items: {},
  },
  joinedAllGroups: {
    isRefresh: false,
    isLoading: false,
    canLoadMore: true,
    ids: [],
    items: {},
  },
  managed: {
    isRefresh: false,
    owner: {
      canLoadMore: true,
      ids: [],
      items: {},
    },
    manage: {
      isLoading: false,
      canLoadMore: true,
      ids: [],
      items: {},
    },
  },
  isGettingInfoDetailError: false,
  isGettingInfoDetail: false,
  globalSearch: {
    loading: false,
    canLoadMore: true,
    ids: [] as string[],
    items: {},
  },
  communitySearch: {
    loading: false,
    canLoadMore: true,
    ids: [] as string[],
    items: {},
  },
};

function groupsReducer(state = groupInitState, action: any = {}) {
  const { type, payload } = action;
  const {
    selectedUsers,
    groupSearchMembers,
    globalSearch,
  } = state;

  switch (type) {
    case groupsTypes.CLEAR_GROUP_SEARCH_MEMBERS:
      return {
        ...state,
        groupSearchMembers: groupInitState.groupSearchMembers,
      };
    case groupsTypes.SET_GROUP_SEARCH_MEMBERS:
      return {
        ...state,
        groupSearchMembers: {
          ...groupSearchMembers,
          ...payload,
        },
      };
    case groupsTypes.SET_JOINABLE_USERS:
      return {
        ...state,
        users: {
          ...state.users,
          ...payload,
        },
      };
    case groupsTypes.SET_EXTRA_JOINABLE_USERS:
      return {
        ...state,
        users: {
          ...state.users,
          ...payload,
        },
      };
    case groupsTypes.SET_MERGE_EXTRA_JOINABLE_USERS:
      return {
        ...state,
        users: {
          ...state.users,
          ...payload,
        },
      };
    case groupsTypes.SELECT_JOINABLE_USERS: {
      const included = selectedUsers.find(
        (item: IUser) => payload.id === item.id,
      );
      return {
        ...state,
        selectedUsers: included
          ? selectedUsers.filter((user) => user.id !== payload.id)
          : [...selectedUsers, payload],
      };
    }
    case groupsTypes.CLEAR_SELECTED_USERS:
      return {
        ...state,
        selectedUsers: [],
      };

    case groupsTypes.RESET_JOINABLE_USERS:
      return {
        ...state,
        users: groupInitState.users,
      };

    case groupsTypes.GET_COMMUNITY_GROUPS:
      return {
        ...state,
        loadingJoinedGroups: true,
        joinedGroups: groupInitState.joinedGroups,
      };

    case groupsTypes.EDIT_DISCOVER_COMMUNITY_ITEM:
      return {
        ...state,
        globalSearch:
          globalSearch?.items && globalSearch.items?.[payload.id]
            ? {
              ...globalSearch,
              items: {
                ...globalSearch.items,
                [payload.id]: {
                  ...globalSearch.items[payload.id],
                  ...payload.data,
                },
              },
            }
            : globalSearch,
      };
    case groupsTypes.SET_GLOBAL_SEARCH:
      return {
        ...state,
        globalSearch: {
          ...state.globalSearch,
          ...payload,
        },
      };
    case groupsTypes.RESET_GLOBAL_SEARCH:
      return {
        ...state,
        globalSearch: groupInitState.globalSearch,
      };
    default:
      return state;
  }
}

export default groupsReducer;
