import groupsTypes from '~/screens/Groups/redux/types';
const initGroupsState = {
  loadingJoinedGroups: false,
  joinedGroups: [],
  loadingGroupDetail: false,
  groupDetail: {
    group: undefined,
  },
  groupMember: {
    skip: 0,
    take: 20,
    canLoadMore: true,
    //type admin, member...
  },
  loadingGroupPosts: false,
  groupPosts: [],
};

function groupsReducer(state = initGroupsState, action: any = {}) {
  const {type} = action;
  switch (type) {
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
          group: action.payload,
        },
      };
    case groupsTypes.SET_GROUP_DETAIL:
      return {
        ...state,
        groupDetail: action.payload || {},
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
      };

    default:
      return state;
  }
}

export default groupsReducer;
