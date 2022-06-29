import {ICommunity, ICommunityMembers} from '~/interfaces/ICommunity';
import appConfig from '~/configs/appConfig';
import groupsTypes from '~/screens/Groups/redux/types';
import {IUser} from '~/interfaces/IAuth';
import {IGroupDetail, IGroupMembers, IJoiningMember} from '~/interfaces/IGroup';
import {IObject} from '~/interfaces/common';
import {getNewSchemeRolesOnUpdatePermission} from '~/screens/Groups/CreatePermissionScheme/helper';

export const groupInitState = {
  permissionScheme: {
    categories: {
      data: undefined,
      loading: false,
    },
    systemScheme: {
      data: undefined,
      loading: false,
    },
    communityScheme: {
      loading: false,
      deleting: false,
      data: undefined,
    },
    schemes: {
      loading: false,
      data: {
        communityScheme: undefined,
        groupSchemes: undefined,
      },
    },
    creatingScheme: {
      data: undefined,
      memberRoleIndex: 0,
      creating: false,
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
    },
  },
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
  groupMembers: {
    loading: false,
    canLoadMore: true,
    offset: 0, // current fetched data count
    // group_admin: {}, group_member: {}
  },
  groupSearchMembers: {
    loading: false,
    canLoadMore: true,
    data: [] as IGroupMembers[],
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
    total: 0,
    loading: false,
    data: [],
    items: {} as IObject<IJoiningMember>,
    canLoadMore: true,
  },
  // temporarily stores data for `undo` action
  undoData: {
    total: 0,
    loading: null,
    canLoadMore: null,
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
    ids: [],
    items: {},
  },
  managedCommunities: {
    loading: false,
    canLoadMore: true,
    data: [] as number[],
    items: {},
  },
  communityDetail: {} as ICommunity,
  isGettingInfoDetail: false,
  communityMembers: {
    loading: false,
    canLoadMore: true,
    offset: 0, // current fetched data count
    // community_admin: {}, community_member: {}
  },
  communitySearchMembers: {
    loading: false,
    canLoadMore: true,
    data: [] as ICommunityMembers[],
  },
  discoverGroups: {
    loading: false,
    data: [],
    items: {},
    canLoadMore: true,
  },
  communityMemberRequests: {
    total: 0,
    loading: false,
    canLoadMore: true,
    ids: [] as number[],
    items: {},
  },
  // temporarily stores data for `undo` action
  undoCommunityMemberRequests: {
    total: 0,
    loading: null,
    canLoadMore: null,
    ids: [],
    items: {} as IObject<IJoiningMember>,
  },

  communitySearch: {
    loading: false,
    canLoadMore: true,
    ids: [] as number[],
    items: {},
  },
};

function groupsReducer(state = groupInitState, action: any = {}) {
  const {type, payload} = action;
  const {
    selectedUsers,
    pendingMemberRequests,
    discoverGroups,
    communityMembers,
    communitySearchMembers,
    managedCommunities,
    groupMembers,
    groupSearchMembers,
    discoverCommunities,
    communityMemberRequests,
  } = state;

  switch (type) {
    //Group Structure Settings
    case groupsTypes.SET_GROUP_STRUCTURE:
      return {
        ...state,
        groupStructure: payload ? {...payload} : groupInitState.groupStructure,
      };
    case groupsTypes.SET_GROUP_STRUCTURE_COMMUNITY_TREE:
      return {
        ...state,
        groupStructure: {
          ...state.groupStructure,
          communityTree: payload
            ? {...payload}
            : groupInitState.groupStructure.communityTree,
        },
      };
    case groupsTypes.SET_GROUP_STRUCTURE_REORDER:
      return {
        ...state,
        groupStructure: {
          ...state.groupStructure,
          reorder: payload
            ? {...payload}
            : groupInitState.groupStructure.reorder,
        },
      };
    case groupsTypes.SET_GROUP_STRUCTURE_MOVE:
      return {
        ...state,
        groupStructure: {
          ...state.groupStructure,
          move: payload ? {...payload} : groupInitState.groupStructure.move,
        },
      };
    // Permission
    case groupsTypes.SET_PERMISSION_CATEGORIES:
      return {
        ...state,
        permissionScheme: {
          ...state.permissionScheme,
          categories: payload,
        },
      };
    case groupsTypes.SET_SYSTEM_SCHEME:
      return {
        ...state,
        permissionScheme: {
          ...state.permissionScheme,
          systemScheme: payload,
        },
      };
    case groupsTypes.SET_CREATING_SCHEME:
      return {
        ...state,
        permissionScheme: {
          ...state.permissionScheme,
          creatingScheme: payload
            ? {
                ...state.permissionScheme.creatingScheme,
                ...payload,
              }
            : {},
        },
      };
    case groupsTypes.SET_CREATING_SCHEME_DATA:
      return {
        ...state,
        permissionScheme: {
          ...state.permissionScheme,
          creatingScheme: {
            ...state.permissionScheme.creatingScheme,
            data: payload
              ? Object.assign(
                  state.permissionScheme.creatingScheme.data,
                  payload,
                )
              : {},
          },
        },
      };
    case groupsTypes.UPDATE_CREATING_SCHEME_PERMISSION: {
      const {permission, roleIndex} = payload || {};
      // @ts-ignore
      const roles = state.permissionScheme.creatingScheme?.data?.roles || [];
      const newRoles = getNewSchemeRolesOnUpdatePermission(
        permission,
        roleIndex,
        roles,
      );
      const newData = Object.assign(
        // @ts-ignore
        state.permissionScheme.creatingScheme.data,
        {roles: newRoles},
      );
      return {
        ...state,
        permissionScheme: {
          ...state.permissionScheme,
          creatingScheme: {
            ...state.permissionScheme.creatingScheme,
            data: newData,
          },
        },
      };
    }
    case groupsTypes.SET_COMMUNITY_SCHEME:
      return {
        ...state,
        permissionScheme: {
          ...state.permissionScheme,
          communityScheme: payload,
        },
      };
    case groupsTypes.SET_SCHEMES:
      return {
        ...state,
        permissionScheme: {
          ...state.permissionScheme,
          schemes: payload,
        },
      };

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

    case groupsTypes.CLEAR_GROUP_MEMBER:
      return {
        ...state,
        groupMembers: groupInitState.groupMembers,
      };
    case groupsTypes.SET_GROUP_MEMBER:
      return {
        ...state,
        groupMembers: {
          ...groupMembers,
          ...payload,
        },
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
    case groupsTypes.SET_MEMBER_REQUESTS:
      return {
        ...state,
        pendingMemberRequests: {
          ...pendingMemberRequests,
          ...payload,
        },
      };
    case groupsTypes.RESET_MEMBER_REQUESTS:
      return {
        ...state,
        pendingMemberRequests: groupInitState.pendingMemberRequests,
      };
    case groupsTypes.DECLINE_ALL_MEMBER_REQUESTS:
      return {
        ...state,
        undoData: groupInitState.undoData,
      };
    case groupsTypes.UNDO_DECLINE_MEMBER_REQUESTS:
      return {
        ...state,
        pendingMemberRequests: {...state.undoData},
        undoData: groupInitState.undoData,
      };
    case groupsTypes.STORE_UNDO_DATA:
      return {
        ...state,
        undoData: {...pendingMemberRequests},
      };
    case groupsTypes.EDIT_GROUP_MEMBER_REQUEST:
      return {
        ...state,
        pendingMemberRequests: {
          ...pendingMemberRequests,
          items: {
            ...pendingMemberRequests.items,
            [payload.id]: {
              // @ts-ignore
              ...pendingMemberRequests.items[payload.id],
              ...payload.data,
            },
          },
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
    case groupsTypes.RESET_DISCOVER_COMMUNITIES:
      return {
        ...state,
        discoverCommunities: groupInitState.discoverCommunities,
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
    case groupsTypes.SET_COMMUNITY_LOADING:
      return {
        ...state,
        isGettingInfoDetail: payload,
      };
    case groupsTypes.SET_COMMUNITY_DETAIL:
      return {
        ...state,
        isGettingInfoDetail: false,
        communityDetail: payload,
      };

    case groupsTypes.SET_COMMUNITY_MEMBERS: {
      return {
        ...state,
        communityMembers: {
          ...communityMembers,
          ...payload,
        },
      };
    }
    case groupsTypes.RESET_COMMUNITY_MEMBERS:
      return {
        ...state,
        communityMembers: groupInitState.communityMembers,
      };

    case groupsTypes.RESET_COMMUNITY_SEARCH_MEMBERS:
      return {
        ...state,
        communitySearchMembers: groupInitState.communitySearchMembers,
      };
    case groupsTypes.SET_COMMUNITY_SEARCH_MEMBERS: {
      return {
        ...state,
        communitySearchMembers: {
          ...communitySearchMembers,
          ...payload,
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

    case groupsTypes.SET_MANAGED_COMMUNITIES:
      return {
        ...state,
        managedCommunities: {
          ...managedCommunities,
          ...payload,
        },
      };
    case groupsTypes.RESET_MANAGED_COMMUNITIES:
      return {
        ...state,
        managedCommunities: groupInitState.managedCommunities,
      };
    case groupsTypes.EDIT_DISCOVER_COMMUNITY_ITEM:
      return {
        ...state,
        discoverCommunities: {
          ...discoverCommunities,
          items: {
            ...discoverCommunities.items,
            [payload.id]: {
              // @ts-ignore
              ...discoverCommunities.items[payload.id],
              ...payload.data,
            },
          },
        },
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
        undoCommunityMemberRequests: {...communityMemberRequests},
      };
    case groupsTypes.UNDO_DECLINED_COMMUNITY_MEMBER_REQUESTS:
      return {
        ...state,
        communityMemberRequests: {...state.undoCommunityMemberRequests},
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
              // @ts-ignore
              ...communityMemberRequests.items[payload.id],
              ...payload.data,
            },
          },
        },
      };

    case groupsTypes.SET_COMMUNITY_SEARCH:
      return {
        ...state,
        communitySearch: {
          ...state.communitySearch,
          ...payload,
        },
      };
    case groupsTypes.RESET_COMMUNITY_SEARCH:
      return {
        ...state,
        communitySearch: groupInitState.communitySearch,
      };

    default:
      return state;
  }
}

export default groupsReducer;
