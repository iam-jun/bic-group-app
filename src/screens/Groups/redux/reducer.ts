import {ICommunity} from '~/interfaces/ICommunity';
import appConfig from '~/configs/appConfig';
import groupsTypes from '~/screens/Groups/redux/types';
import {IUser} from '~/interfaces/IAuth';
import {IGroupDetail, IJoiningMember} from '~/interfaces/IGroup';
import {IObject} from '~/interfaces/common';

export const groupInitState = {
  isPrivacyModalOpen: false,
  loadingJoinedGroups: false,
  joinedGroups: [],
  yourGroupsTree: {
    loading: true,
    list: [],
  },
  yourGroupsList: {
    loading: true,
    list: [],
  },
  yourGroupsSearch: {
    showSearch: false,
    loading: false,
    key: '',
    list: [],
  },
  loadingPage: false,
  loadingGroupDetail: false,
  groupDetail: {
    group: {},
  } as IGroupDetail,
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
    total: 0,
    data: [],
    items: {} as IObject<IJoiningMember>,
  },
  joinedCommunities: {
    loading: false,
    data: [],
  },
  discoverCommunities: {
    loading: true,
    canLoadMore: true,
    list: [],
  },
  communityDetail: {} as ICommunity,
  isGettingInfoDetail: false,
  communityMembers: {
    loading: false,
    canLoadMore: true,
    community_admin: {data: [], user_count: 0},
    member: {data: [], user_count: 0},
  },
  searchMembers: {
    loading: false,
    canLoadMore: true,
    community_admin: {data: [], user_count: 0},
    member: {data: [], user_count: 0},
  },

  discoverGroups: {
    loading: false,
    data: [],
    items: {},
    canLoadMore: true,
  },
};

function groupsReducer(state = groupInitState, action: any = {}) {
  const {type, payload} = action;
  const {
    selectedUsers,
    pendingMemberRequests,
    discoverGroups,
    communityMembers,
    searchMembers,
  } = state;

  switch (type) {
    case groupsTypes.SET_PRIVACY_MODAL_OPEN:
      return {
        ...state,
        isPrivacyModalOpen: action.payload,
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
        groupMember: groupInitState.groupMember,
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
        posts: groupInitState.posts,
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
    case groupsTypes.SELECT_JOINABLE_USERS: {
      const included = selectedUsers.find(
        (item: IUser) => payload.id === item.id,
      );
      return {
        ...state,
        selectedUsers: !included
          ? [...selectedUsers, payload]
          : selectedUsers.filter(user => user.id !== payload.id),
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
    case groupsTypes.RESET_MEMBER_REQUESTS:
      return {
        ...state,
        pendingMemberRequests: groupInitState.pendingMemberRequests,
      };
    case groupsTypes.APPROVE_SINGLE_MEMBER_REQUEST:
    case groupsTypes.REMOVE_SINGLE_MEMBER_REQUEST: {
      const requestItems = {...pendingMemberRequests.items};
      delete requestItems[payload];
      return {
        ...state,
        groupDetail: {
          ...state.groupDetail,
          total_pending_members: state.groupDetail.total_pending_members - 1,
        },
        pendingMemberRequests: {
          ...pendingMemberRequests,
          data: pendingMemberRequests.data.filter(
            (item: number) => item !== payload.requestId,
          ),
          items: requestItems,
        },
      };
    }
    case groupsTypes.APPROVE_ALL_MEMBER_REQUESTS:
    case groupsTypes.REMOVE_ALL_MEMBER_REQUESTS:
      return {
        ...state,
        groupDetail: {
          ...state.groupDetail,
          total_pending_members: 0,
        },
        pendingMemberRequests: groupInitState.pendingMemberRequests,
      };
    case groupsTypes.DECLINE_SINGLE_MEMBER_REQUEST:
    case groupsTypes.DECLINE_ALL_MEMBER_REQUESTS:
      return {
        ...state,
        undoData: groupInitState.undoData,
      };
    case groupsTypes.UNDO_DECLINE_MEMBER_REQUESTS:
      return {
        ...state,
        groupDetail: {
          ...state.groupDetail,
          total_pending_members: state.undoData.total,
        },
        pendingMemberRequests: {
          ...state.pendingMemberRequests,
          data: [...state.undoData.data],
          items: {...state.undoData.items},
        },
        undoData: groupInitState.undoData,
      };
    case groupsTypes.STORE_UNDO_DATA:
      return {
        ...state,
        undoData: {
          total: state.groupDetail.total_pending_members,
          data: [...pendingMemberRequests.data],
          items: {...pendingMemberRequests.items},
        },
      };
    case groupsTypes.SET_YOUR_GROUPS_SEARCH:
      return {
        ...state,
        yourGroupsSearch: {
          ...state.yourGroupsSearch,
          ...payload,
        },
      };
    case groupsTypes.SET_YOUR_GROUPS_TREE:
      return {
        ...state,
        yourGroupsTree: {
          ...state.yourGroupsTree,
          ...payload,
        },
      };
    case groupsTypes.SET_YOUR_GROUPS_LIST:
      return {
        ...state,
        yourGroupsList: {
          ...state.yourGroupsList,
          ...payload,
        },
      };
    case groupsTypes.SET_JOINED_COMMUNITIES:
      return {
        ...state,
        joinedCommunities: {
          loading: payload?.loading || false,
          data: payload?.data || [],
        },
      };
    case groupsTypes.SET_DISCOVER_COMMUNITIES:
      return {
        ...state,
        discoverCommunities: {
          ...state.discoverCommunities,
          ...payload,
        },
      };

    case groupsTypes.GET_COMMUNITY_GROUPS:
      return {
        ...state,
        loadingJoinedGroups: true,
        joinedGroups: groupInitState.joinedGroups,
      };
    case groupsTypes.SET_COMMUNITY_GROUPS:
      return {
        ...state,
        loadingJoinedGroups: false,
        joinedGroups: payload || [],
      };
    case groupsTypes.GET_COMMUNITY_DETAIL:
      return {
        ...state,
        isGettingInfoDetail: true,
      };
    case groupsTypes.SET_COMMUNITY_DETAIL:
      return {
        ...state,
        isGettingInfoDetail: false,
        communityDetail: payload,
      };

    case groupsTypes.GET_COMMUNITY_MEMBERS:
      return {
        ...state,
        communityMembers: {
          ...communityMembers,
          loading:
            communityMembers.community_admin.data.length +
              communityMembers.member.data.length ===
            0,
        },
      };
    case groupsTypes.SET_COMMUNITY_MEMBERS: {
      return {
        ...state,
        communityMembers: {
          ...communityMembers,
          loading: false,
          canLoadMore:
            payload.community_admin.data.length + payload.member.data.length ===
            appConfig.recordsPerPage,
          community_admin: {
            data: [
              ...communityMembers.community_admin.data,
              ...payload.community_admin.data,
            ],
            user_count: payload.community_admin.user_count,
          },
          member: {
            data: [...communityMembers.member.data, ...payload.member.data],
            user_count: payload.member.user_count,
          },
        },
      };
    }
    case groupsTypes.RESET_COMMUNITY_MEMBERS:
      return {
        ...state,
        communityMembers: groupInitState.communityMembers,
      };

    case groupsTypes.RESET_SEARCH_MEMBERS:
      return {
        ...state,
        searchMembers: groupInitState.searchMembers,
      };
    case groupsTypes.GET_SEARCH_MEMBERS:
      return {
        ...state,
        searchMembers: {
          ...searchMembers,
          loading:
            searchMembers.community_admin.data.length +
              searchMembers.member.data.length ===
            0,
        },
      };
    case groupsTypes.SET_SEARCH_MEMBERS: {
      return {
        ...state,
        searchMembers: {
          ...searchMembers,
          loading: false,
          canLoadMore:
            payload.community_admin.data.length + payload.member.data.length ===
            appConfig.recordsPerPage,
          community_admin: {
            data: [
              ...searchMembers.community_admin.data,
              ...payload.community_admin.data,
            ],
            user_count: payload.community_admin.user_count,
          },
          member: {
            data: [...searchMembers.member.data, ...payload.member.data],
            user_count: payload.member.user_count,
          },
        },
      };
    }

    case groupsTypes.GET_DISCOVER_GROUPS:
      return {
        ...state,
        discoverGroups: {
          ...discoverGroups,
          loading: discoverGroups.data.length === 0,
        },
      };
    case groupsTypes.SET_DISCOVER_GROUPS:
      return {
        ...state,
        discoverGroups: {
          ...discoverGroups,
          loading: false,
          data: [...discoverGroups.data, ...payload.ids],
          items: {
            ...discoverGroups.items,
            ...payload.items,
          },
          canLoadMore: payload.ids.length === appConfig.recordsPerPage,
        },
      };
    case groupsTypes.RESET_DISCOVER_GROUPS:
      return {
        ...state,
        discoverGroups: groupInitState.discoverGroups,
      };
    case groupsTypes.EDIT_DISCOVER_GROUP_ITEM:
      return {
        ...state,
        discoverGroups: {
          ...discoverGroups,
          items: {
            ...discoverGroups.items,
            [payload.id]: {
              // @ts-ignore
              ...discoverGroups.items[payload.id],
              ...payload.data,
            },
          },
        },
      };

    default:
      return state;
  }
}

export default groupsReducer;
