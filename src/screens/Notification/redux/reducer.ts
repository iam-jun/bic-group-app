import {IParamSetNotifications} from '~/interfaces/INotification';
import notificationsTypes from '~/screens/Notification/redux/types';

export const notiInitState = {
  loadingNotifications: false,
  unseenNumber: 0,
  noMoreNotification: false,
  isLoadingMore: false,
  showMarkedAsReadToast: false,
  pushToken: '',
  notifications: {},
  tabAll: {
    loading: false,
    data: [],
    isLoadingMore: false,
    noMoreData: false,
  },
  tabUnread: {
    loading: false,
    data: [],
    isLoadingMore: false,
    noMoreData: false,
  },
  tabMention: {
    loading: false,
    data: [],
    isLoadingMore: false,
    noMoreData: false,
  },
  tabImportant: {
    loading: false,
    data: [],
    isLoadingMore: false,
    noMoreData: false,
  },
};

function notificationsReducer(state = notiInitState, action: any = {}) {
  const {type, payload} = action;
  switch (type) {
    case notificationsTypes.SET_LOADING_NOTIFICATIONS: {
      const {keyValue, value}: any = payload;
      if (!!keyValue) {
        const newNotificationData: any = {...state};
        newNotificationData[keyValue].loading = value;
        return {
          ...state,
          ...newNotificationData,
        };
      }
      return {
        ...state,
      };
    }
    case notificationsTypes.SET_NOTIFICATIONS: {
      const {keyValue, data, unseen, notifications}: IParamSetNotifications =
        payload;
      if (!!keyValue && data && Array.isArray(data)) {
        const newNotificationData: any = {...state};
        newNotificationData[keyValue].data = [...data];
        return {
          ...state,
          ...newNotificationData,
          notifications: {...state.notifications, ...notifications},
          unseenNumber: unseen,
        };
      }
      return {
        ...state,
      };
    }

    case notificationsTypes.ATTACH: {
      const {notificationFlag} = payload || {};
      const newNotifications: any = {...state};
      if (notificationFlag === 'IMPORTANT') {
        newNotifications.tabImportant.data = [
          payload.id,
          ...newNotifications.tabImportant.data,
        ];
      } else if (notificationFlag === 'MENTION') {
        newNotifications.tabMention.data = [
          payload.id,
          ...newNotifications.tabMention.data,
        ];
      } else {
        newNotifications.tabAll.data = [
          payload.id,
          ...newNotifications.tabAll.data,
        ];
        newNotifications.tabUnread.data = [
          payload.id,
          ...newNotifications.tabUnread.data,
        ];
      }
      const newNotification: any = {...state.notifications};
      newNotification[payload.id] = {...payload};

      return {
        ...state,
        notifications: {...newNotification},
        unseenNumber: state.unseenNumber + 1,
      };
    }
    case notificationsTypes.DETACH: {
      const newNotificationData: any = {...state};
      const removeDetachNoti = (value: string) => {
        newNotificationData[value].data = newNotificationData[
          value
        ]?.data?.filter?.((item: any) => item !== payload?.id);
      };
      removeDetachNoti('tabAll');
      removeDetachNoti('tabUnread');
      removeDetachNoti('tabMention');
      removeDetachNoti('tabImportant');

      return {
        ...state,
        ...newNotificationData,
        unseenNumber: state.unseenNumber - 1,
      };
    }
    case notificationsTypes.UPDATE: {
      let newUnSeenNumber = state.unseenNumber;
      const {notifications}: any = state;
      if (notifications[payload.id]?.isSeen) {
        newUnSeenNumber = newUnSeenNumber + 1;
      }

      const newNotification: any = {...state.notifications};
      newNotification[payload.id] = {...payload};

      return {
        ...state,
        notifications: {...newNotification},
        unseenNumber: newUnSeenNumber,
      };
    }
    case notificationsTypes.CONCAT_NOTIFICATIONS: {
      const {keyValue, notifications, data}: any = payload;
      if (!!keyValue) {
        const newNotificationData: any = {...state};
        newNotificationData[keyValue]?.data?.concat(data || []);
        return {
          ...state,
          ...newNotificationData,
          notifications: {...state.notifications, ...notifications},
        };
      }
      return {
        ...state,
      };
    }
    case notificationsTypes.SET_NO_MORE_NOTIFICATION: {
      const {keyValue, value}: any = payload;
      if (!!keyValue) {
        const newNotificationData: any = {...state};
        newNotificationData[keyValue].noMoreData = value;
        return {
          ...state,
          ...newNotificationData,
        };
      }
      return {
        ...state,
      };
    }
    case notificationsTypes.SET_IS_LOADING_MORE: {
      const {keyValue, value}: any = payload;
      if (!!keyValue) {
        const newNotificationData: any = {...state};
        newNotificationData[keyValue].isLoadingMore = value;
        return {
          ...state,
          ...newNotificationData,
        };
      }
      return {
        ...state,
      };
    }
    case notificationsTypes.SET_ALL_NOTIFICATIONS: {
      return {
        ...state,
        notifications: payload.notifications,
        unseenNumber:
          typeof payload?.unseenNumber === 'number'
            ? payload.unseenNumber
            : state.unseenNumber,
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
