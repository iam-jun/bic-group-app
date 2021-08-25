import {IGetStreamDispatch} from '~/interfaces/common';
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

  //for saga
  getNotifications: function (payload: IGetStreamDispatch) {
    return {
      type: notificationsTypes.GET_NOTIFICATIONS,
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
};

export default notificationsActions;
