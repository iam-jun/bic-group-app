import {IGetStreamDispatch} from '~/interfaces/common';
import {
  IDeleteNotifications,
  ILoadNewNotifications,
  IMarkAsReadAnActivity,
} from '~/interfaces/INotification';
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
  addNewNotifications: function (payload: any) {
    return {
      type: notificationsTypes.ADD_NEW_NOTIFICATIONS,
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
  getNotifications: function (payload: IGetStreamDispatch) {
    return {
      type: notificationsTypes.GET_NOTIFICATIONS,
      payload,
    };
  },
  loadNewNotifications: function (payload: ILoadNewNotifications) {
    return {
      type: notificationsTypes.LOAD_NEW_NOTIFICATIONS,
      payload,
    };
  },
  deleteNotifications: function (payload: IDeleteNotifications) {
    return {
      type: notificationsTypes.DELETE_NOTIFICATIONS,
      payload,
    };
  },
  markAsReadAll: function (payload: IGetStreamDispatch) {
    return {
      type: notificationsTypes.MARK_AS_READ_ALL,
      payload,
    };
  },
  markAsSeenAll: function (payload: IGetStreamDispatch) {
    return {
      type: notificationsTypes.MARK_AS_SEEN_ALL,
      payload,
    };
  },
  markAsRead: function (payload: IMarkAsReadAnActivity) {
    return {
      type: notificationsTypes.MARK_AS_READ,
      payload,
    };
  },
  loadmore: function (payload: IGetStreamDispatch) {
    return {
      type: notificationsTypes.LOADMORE,
      payload,
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
