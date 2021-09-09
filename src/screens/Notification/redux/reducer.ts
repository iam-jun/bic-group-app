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
      const newList = state.notificationList;
      newList.unshift(...newNotifications);
      return {
        ...state,
        notificationList: newList,
        unseenNumber: state.unseenNumber + payload.unseen,
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
