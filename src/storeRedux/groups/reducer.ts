import groupsTypes from '~/storeRedux/groups/types';
import { IUser } from '~/interfaces/IAuth';
import {
  IGroupMembers,
  IJoiningMember,
} from '~/interfaces/IGroup';
import { IObject } from '~/interfaces/common';

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

  groupMemberRequests: {
    total: 0,
    loading: true,
    ids: [] as string[],
    items: {} as IObject<IJoiningMember>,
    canLoadMore: true,
  },
  // temporarily stores data for `undo` action
  undoGroupMemberRequests: {
    total: 0,
    loading: null,
    canLoadMore: null,
    data: [],
    items: {} as IObject<IJoiningMember>,
  },
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
  communityMemberRequests: {
    total: 0,
    loading: true,
    canLoadMore: true,
    ids: [] as string[],
    items: {} as IObject<IJoiningMember>,
  },
  // temporarily stores data for `undo` action
  undoCommunityMemberRequests: {
    total: 0,
    loading: null,
    canLoadMore: null,
    ids: [],
    items: {} as IObject<IJoiningMember>,
  },
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
    groupMemberRequests,
    groupSearchMembers,
    communityMemberRequests,
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

    // PENDING MEMBER REQUESTS
    case groupsTypes.SET_GROUP_MEMBER_REQUESTS:
      return {
        ...state,
        groupMemberRequests: {
          ...groupMemberRequests,
          ...payload,
        },
      };
    case groupsTypes.RESET_GROUP_MEMBER_REQUESTS:
      return {
        ...state,
        groupMemberRequests: groupInitState.groupMemberRequests,
      };
    case groupsTypes.DECLINE_ALL_GROUP_MEMBER_REQUESTS:
      return {
        ...state,
        undoGroupMemberRequests: groupInitState.undoGroupMemberRequests,
      };
    case groupsTypes.UNDO_DECLINED_GROUP_MEMBER_REQUESTS:
      return {
        ...state,
        groupMemberRequests: { ...state.undoGroupMemberRequests },
        undoGroupMemberRequests: groupInitState.undoGroupMemberRequests,
      };
    case groupsTypes.STORE_UNDO_GROUP_MEMBER_REQUESTS:
      return {
        ...state,
        undoGroupMemberRequests: { ...groupMemberRequests },
      };
    case groupsTypes.EDIT_GROUP_MEMBER_REQUEST:
      return {
        ...state,
        groupMemberRequests: {
          ...groupMemberRequests,
          items: {
            ...groupMemberRequests.items,
            [payload.id]: {
              ...groupMemberRequests.items[payload.id],
              ...payload.data,
            },
          },
        },
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

    case groupsTypes.SET_COMMUNITY_MEMBER_REQUESTS:
      return {
        ...state,
        communityMemberRequests: {
          ...communityMemberRequests,
          ...payload,
        },
      };
    case groupsTypes.RESET_COMMUNITY_MEMBER_REQUESTS:
      return {
        ...state,
        communityMemberRequests: groupInitState.communityMemberRequests,
      };
    case groupsTypes.STORE_UNDO_COMMUNITY_MEMBER_REQUESTS:
      return {
        ...state,
        undoCommunityMemberRequests: { ...communityMemberRequests },
      };
    case groupsTypes.UNDO_DECLINED_COMMUNITY_MEMBER_REQUESTS:
      return {
        ...state,
        communityMemberRequests: { ...state.undoCommunityMemberRequests },
        undoCommunityMemberRequests: groupInitState.undoCommunityMemberRequests,
      };
    case groupsTypes.DECLINE_ALL_COMMUNITY_MEMBER_REQUESTS:
      return {
        ...state,
        undoCommunityMemberRequests: groupInitState.undoCommunityMemberRequests,
      };
    case groupsTypes.EDIT_COMMUNITY_MEMBER_REQUEST:
      return {
        ...state,
        communityMemberRequests: {
          ...communityMemberRequests,
          items: {
            ...communityMemberRequests.items,
            [payload.id]: {
              ...communityMemberRequests.items[payload.id],
              ...payload.data,
            },
          },
        },
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
