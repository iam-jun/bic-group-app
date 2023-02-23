import groupsTypes from '~/storeRedux/groups/types';

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
  const { type } = action;

  switch (type) {
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
