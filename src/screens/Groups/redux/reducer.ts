import groupsTypes from '~/screens/Groups/redux/types';
const initGroupsState = {
  loadingJoinedGroups: false,
  joinedGroups: [],
  loadingGroupDetail: false,
  groupDetail: {},
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
    case groupsTypes.SET_GROUP_DETAIL:
      return {
        ...state,
        groupDetail: action.payload || {},
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
