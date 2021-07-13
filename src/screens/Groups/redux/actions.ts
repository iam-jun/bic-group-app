import groupsTypes from "~/screens/Groups/redux/types";
import {IGroup} from "~/interfaces/IGroup";

const groupsActions = {
    setLoadingJoinedGroups: function (payload: boolean) {
        return {
            type: groupsTypes.SET_LOADING_JOINED_GROUPS,
            payload,
        };
    },
    setJoinedGroups: function (payload: IGroup[]) {
        return {
            type: groupsTypes.SET_JOINED_GROUPS,
            payload,
        };
    },

    //for saga
    getJoinedGroups: function (payload: any | undefined) {
        return {
            type: groupsTypes.GET_JOINED_GROUPS,
            payload,
        }
    },
}

export default groupsActions;
