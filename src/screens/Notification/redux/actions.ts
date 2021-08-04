import {IGetStreamDispatch} from '~/interfaces/common';
import notificationsTypes from '~/screens/Notification/redux/types';

const notificationsActions = {
  setLoadingNotifications: function (payload: boolean) {
    return {
      type: notificationsTypes.SET_LOADING_NOTIFICATIONS,
      payload,
    };
  },
  setNotifications: function (payload: any[]) {
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
};

export default notificationsActions;
