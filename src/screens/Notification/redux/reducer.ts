import notificationsTypes from '~/screens/Notification/redux/types';

const initNotificationsState = {
  loadingNotifications: false,
  notificationList: [],
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
        notificationList: payload || [],
      };

    default:
      return state;
  }
}

export default notificationsReducer;
