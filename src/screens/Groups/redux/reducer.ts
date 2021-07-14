import groupsTypes from "~/screens/Groups/redux/types";
const initGroupsState = {
    loadingJoinedGroups: false,
    joinedGroups: [],
    loadingGroupDetail: false,
    groupDetail: {},
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
        case groupsTypes.SET_GROUP_DETAIL:
            return {
                ...state,
                groupDetail: action.payload || {},
            };
        default:
            return state;
    }
}

export default groupsReducer;
