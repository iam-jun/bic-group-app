import {cloneDeep} from 'lodash';
import notificationsTypes from '~/screens/Notification/redux/types';

const initNotificationsState = {
  loadingNotifications: false,
  notificationList: [],
  unseenNumber: 0,
  noMoreNotification: false,
  isLoadingMore: false,
  showMarkedAsReadToast: false,
};

function notificationsReducer(
  state = initNotificationsState,
  action: any = {},
) {
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
      const newGroupIds = newNotifications.map((noti: any) => noti.group);
      notificationList = notificationList.filter((noti: any) => {
        return !newGroupIds.includes(noti.group);
      });
      // then add the grouped notification that is updated at top of list
      notificationList.unshift(...newNotifications);

      return {
        ...state,
        notificationList: notificationList,
        unseenNumber: state.unseenNumber + payload.unseen,
      };
    }
    case notificationsTypes.DELETE_NOTIFICATIONS: {
      const newListAfterDelete = state.notificationList.filter(item => {
        return !payload.notiGroupIds.includes(item.group);
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
        noMoreNotification: true,
      };
    case notificationsTypes.SET_IS_LOADING_MORE: {
      return {
        ...state,
        isLoadingMore: payload,
      };
    }

    default:
      return state;
  }
}

export default notificationsReducer;
