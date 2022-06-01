import {IParamSetNotifications} from '~/interfaces/INotification';
import notificationsTypes from '~/screens/Notification/redux/types';

export const notiInitState = {
  loadingNotifications: false,
  unseenNumber: 0,
  noMoreNotification: false,
  isLoadingMore: false,
  showMarkedAsReadToast: false,
  pushToken: '',
  notificationList: {
    ALL: {
      loading: false,
      data: [],
      isLoadingMore: false,
      noMoreData: false,
    },
    UNREAD: {
      loading: false,
      data: [],
      isLoadingMore: false,
      noMoreData: false,
    },
    MENTION: {
      loading: false,
      data: [],
      isLoadingMore: false,
      noMoreData: false,
    },
    IMPORTANT: {
      loading: false,
      data: [],
      isLoadingMore: false,
      noMoreData: false,
    },
  },
};

function notificationsReducer(state = notiInitState, action: any = {}) {
  const {type, payload} = action;
  switch (type) {
    case notificationsTypes.SET_LOADING_NOTIFICATIONS: {
      const {flag, value}: any = payload;
      if (!!flag) {
        const newNotifications = {...state.notificationList};
        newNotifications[flag].loading = value;
        return {
          ...state,
          notificationList: {...newNotifications},
        };
      }
      return {
        ...state,
      };
    }
    case notificationsTypes.SET_NOTIFICATIONS: {
      const {flag, data, unseen}: IParamSetNotifications = payload;
      if (!!flag && data && Array.isArray(data)) {
        const newNotifications = {...state.notificationList};
        newNotifications[flag].data = [...data];
        return {
          ...state,
          notificationList: {...newNotifications},
          unseenNumber: unseen,
        };
      }
      return {
        ...state,
      };
    }

    case notificationsTypes.ATTACH: {
      return {
        ...state,
        // notificationList: [payload, ...state.notificationList],
        unseenNumber: state.unseenNumber + 1,
      };
    }
    case notificationsTypes.DETACH: {
      return {
        ...state,
        // notificationList: state.notificationList.filter(
        //   (item: any) => item.id !== payload?.id,
        // ),
        unseenNumber: state.unseenNumber - 1,
      };
    }
    case notificationsTypes.UPDATE: {
      let newUnSeenNumber = state.unseenNumber;
      const newListNotification = state.notificationList.filter((item: any) => {
        if (item.id === payload?.id && item?.isSeen) {
          newUnSeenNumber = newUnSeenNumber + 1;
        }
        return item.id !== payload?.id;
      });
      return {
        ...state,
        notificationList: [payload, ...newListNotification],
        unseenNumber: newUnSeenNumber,
      };
    }
    case notificationsTypes.CONCAT_NOTIFICATIONS:
      return {
        ...state,
        // notificationList: state.notificationList.concat(
        //   payload.notifications || [],
        // ),
      };
    case notificationsTypes.SET_NO_MORE_NOTIFICATION: {
      const {flag, value}: any = payload;
      if (!!flag) {
        const newNotifications = {...state.notificationList};
        newNotifications[flag].noMoreData = value;
        return {
          ...state,
          notificationList: {...newNotifications},
        };
      }
      return {
        ...state,
      };
    }
    case notificationsTypes.SET_IS_LOADING_MORE: {
      const {flag, value}: any = payload;
      if (!!flag) {
        const newNotifications = {...state.notificationList};
        newNotifications[flag].isLoadingMore = value;
        return {
          ...state,
          notificationList: {...newNotifications},
        };
      }
      return {
        ...state,
      };
    }
    case notificationsTypes.SET_ALL_NOTIFICATIONS: {
      return {
        ...state,
        notificationList: {...payload},
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
