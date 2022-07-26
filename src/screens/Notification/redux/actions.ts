import {
  IParamGetNotifications,
  IParamSetNotifications,
} from '~/interfaces/INotification';
import notificationsTypes from '~/screens/Notification/redux/types';

const notificationsActions = {
  setLoadingNotifications(payload: any) {
    return {
      type: notificationsTypes.SET_LOADING_NOTIFICATIONS,
      payload,
    };
  },
  setNotifications(payload: IParamSetNotifications) {
    return {
      type: notificationsTypes.SET_NOTIFICATIONS,
      payload,
    };
  },
  concatNotifications(payload: any) {
    return {
      type: notificationsTypes.CONCAT_NOTIFICATIONS,
      payload,
    };
  },

  // for saga
  getNotifications(payload?: IParamGetNotifications) {
    return {
      type: notificationsTypes.GET_NOTIFICATIONS,
      payload,
    };
  },
  attachNotification(payload: any) {
    return {
      type: notificationsTypes.ATTACH,
      payload,
    };
  },
  detachNotification(payload: any) {
    return {
      type: notificationsTypes.DETACH,
      payload,
    };
  },
  updateNotification(payload: any) {
    return {
      type: notificationsTypes.UPDATE,
      payload,
    };
  },
  markAsReadAll(payload: string) {
    return {
      type: notificationsTypes.MARK_AS_READ_ALL,
      payload,
    };
  },
  markAsSeenAll() {
    return {
      type: notificationsTypes.MARK_AS_SEEN_ALL,
    };
  },
  markAsRead(payload: any) {
    return {
      type: notificationsTypes.MARK_AS_READ,
      payload,
    };
  },
  markAsUnRead(payload: any) {
    return {
      type: notificationsTypes.MARK_AS_UNREAD,
      payload,
    };
  },
  loadMore(payload: IParamGetNotifications) {
    return {
      type: notificationsTypes.LOAD_MORE,
      payload,
    };
  },
  setIsLoadingMore(payload: any) {
    return {
      type: notificationsTypes.SET_IS_LOADING_MORE,
      payload,
    };
  },
  setNoMoreNoti: (payload: any) => ({
    type: notificationsTypes.SET_NO_MORE_NOTIFICATION,
    payload,
  }),
  registerPushToken: (payload?: any) => ({
    type: notificationsTypes.REGISTER_PUSH_TOKEN,
    payload,
  }),
  savePushToken: (payload: string) => ({
    type: notificationsTypes.SAVE_PUSH_TOKEN,
    payload,
  }),
  setAllNotifications: (payload: any) => ({
    type: notificationsTypes.SET_ALL_NOTIFICATIONS,
    payload,
  }),
};

export default notificationsActions;
