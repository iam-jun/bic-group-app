import {IParamGetNotifications} from '~/interfaces/INotification';
import notificationsTypes from '~/screens/Notification/redux/types';

const notificationsActions = {
  setLoadingNotifications: function (payload: boolean) {
    return {
      type: notificationsTypes.SET_LOADING_NOTIFICATIONS,
      payload,
    };
  },
  setNotifications: function (payload: any) {
    return {
      type: notificationsTypes.SET_NOTIFICATIONS,
      payload,
    };
  },
  concatNotifications: function (payload: any) {
    return {
      type: notificationsTypes.CONCAT_NOTICATIONS,
      payload,
    };
  },

  //for saga
  getNotifications: function (payload?: IParamGetNotifications) {
    return {
      type: notificationsTypes.GET_NOTIFICATIONS,
      payload,
    };
  },
  attachNotification: function (payload: any) {
    return {
      type: notificationsTypes.ATTACH,
      payload,
    };
  },
  detachNotification: function (payload: any) {
    return {
      type: notificationsTypes.DETACH,
      payload,
    };
  },
  updateNotification: function (payload: any) {
    return {
      type: notificationsTypes.UPDATE,
      payload,
    };
  },
  markAsReadAll: function () {
    return {
      type: notificationsTypes.MARK_AS_READ_ALL,
    };
  },
  markAsSeenAll: function () {
    return {
      type: notificationsTypes.MARK_AS_SEEN_ALL,
    };
  },
  markAsRead: function (payload: string) {
    return {
      type: notificationsTypes.MARK_AS_READ,
      payload,
    };
  },
  loadmore: function () {
    return {
      type: notificationsTypes.LOADMORE,
    };
  },
  setIsLoadingMore: function (payload: boolean) {
    return {
      type: notificationsTypes.SET_IS_LOADING_MORE,
      payload,
    };
  },
  setNoMoreNoti: (payload: boolean) => {
    return {
      type: notificationsTypes.SET_NO_MORE_NOTIFICATION,
      payload,
    };
  },
  registerPushToken: (payload?: any) => {
    return {
      type: notificationsTypes.REGISTER_PUSH_TOKEN,
      payload,
    };
  },
  savePushToken: (payload: string) => {
    return {
      type: notificationsTypes.SAVE_PUSH_TOKEN,
      payload,
    };
  },
};

export default notificationsActions;
