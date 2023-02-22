import groupsTypes from '~/storeRedux/groups/types';
import { IUser } from '~/interfaces/IAuth';

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
  } = state;

  switch (type) {
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

    default:
      return state;
  }
}

export default groupsReducer;
