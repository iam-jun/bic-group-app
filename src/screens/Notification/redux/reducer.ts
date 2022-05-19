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

    case notificationsTypes.ATTACH: {
      return {
        ...state,
        notificationList: [payload, ...state.notificationList],
        unseenNumber: state.unseenNumber + 1,
      };
    }
    case notificationsTypes.DETACH: {
      return {
        ...state,
        notificationList: state.notificationList.filter(
          (item: any) => item.id !== payload?.id,
        ),
        unseenNumber: state.unseenNumber - 1,
      };
    }
    case notificationsTypes.UPDATE: {
      let newUnSeenNumber = state.unseenNumber;
      state.notificationList.map((item: any) => {
        if (item.id === payload?.id && item?.isSeen) {
          newUnSeenNumber = newUnSeenNumber + 1;
        }
      });
      return {
        ...state,
        notificationList: state.notificationList.map((item: any) =>
          item.id === payload?.id ? payload : item,
        ),
        unseenNumber: newUnSeenNumber,
      };
    }
    case notificationsTypes.CONCAT_NOTIFICATIONS:
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
