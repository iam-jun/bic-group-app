import {cloneDeep} from 'lodash';
import notificationsTypes from '~/screens/Notification/redux/types';

export const notiInitState = {
  loadingNotifications: false,
  notificationList: [],
  unseenNumber: 0,
  noMoreNotification: false,
  isLoadingMore: false,
  showMarkedAsReadToast: false,
  pushToken: '',
};

function notificationsReducer(state = notiInitState, action: any = {}) {
  const {type, payload} = action;
  switch (type) {
    case notificationsTypes.SET_LOADING_NOTIFICATIONS:
      return {
        ...state,
        loadingNotifications: payload,
      };
    case notificationsTypes.SET_NOTIFICATIONS:
      return {
        ...state,
        notificationList: payload.notifications || [],
        unseenNumber: payload.unseen,
      };
    case notificationsTypes.ADD_NEW_NOTIFICATIONS: {
      const newNotifications = payload.notifications || [];
      let notificationList: any[] = cloneDeep(state.notificationList);

      // if the notification group id is existing, remove old items
      const newGroupIds = newNotifications.map((noti: any) => noti.entityId);
      notificationList = notificationList.filter((noti: any) => {
        return !newGroupIds.includes(noti.entityId);
      });
      // then add the grouped notification that is updated at top of list
      notificationList.unshift(...newNotifications);

      return {
        ...state,
        notificationList: notificationList,
        unseenNumber: payload.unseen || state.unseenNumber,
      };
    }
    case notificationsTypes.DELETE_NOTIFICATIONS: {
      const newListAfterDelete = state.notificationList.filter((item: any) => {
        return !payload.notiGroupIds.includes(item.entityId);
      });
      return {
        ...state,
        notificationList: newListAfterDelete,
      };
    }
    case notificationsTypes.CONCAT_NOTICATIONS:
      return {
        ...state,
        notificationList: state.notificationList.concat(
          payload.notifications || [],
        ),
      };
    case notificationsTypes.SET_NO_MORE_NOTIFICATION:
      return {
        ...state,
        noMoreNotification: payload,
      };
    case notificationsTypes.SET_IS_LOADING_MORE: {
      return {
        ...state,
        isLoadingMore: payload,
      };
    }
    case notificationsTypes.SAVE_PUSH_TOKEN: {
      return {
        ...state,
        pushToken: payload,
      };
    }

    default:
      return state;
  }
}

export default notificationsReducer;
