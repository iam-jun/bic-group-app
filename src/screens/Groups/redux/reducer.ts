import groupsTypes from '~/screens/Groups/redux/types';
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
};

function groupsReducer(state = initGroupsState, action: any = {}) {
  const {type} = action;
  switch (type) {
    case groupsTypes.SET_PRIVACY_MODAL_OPEN:
      return {
        ...state,
        isPrivacyModalOpen: action.payload,
      };
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
          ...state.groupDetail,
          group: action.payload,
        },
      };
    case groupsTypes.SET_GROUP_DETAIL:
      return {
        ...state,
        groupDetail: {
          ...state.groupDetail,
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

    default:
      return state;
  }
}

export default groupsReducer;
