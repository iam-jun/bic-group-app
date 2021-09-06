import {IGetStreamDispatch} from '~/interfaces/common';
import notificationsTypes from '~/screens/Notification/redux/types';
import {
  ILoadNewNotifications,
  IMarkAsReadAnActivity,
} from '~/interfaces/INotification';

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
  setShowMarkedAsReadToast: function (payload: boolean) {
    return {
      type: notificationsTypes.SHOW_MARKED_AS_READ_TOAST,
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
};

export default notificationsActions;
