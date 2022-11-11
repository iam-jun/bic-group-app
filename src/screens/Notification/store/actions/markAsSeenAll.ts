import { cloneDeep } from 'lodash';
import notificationApi from '~/api/NotificationApi';
import showError from '~/store/helper/showError';

import INotificationsState from '../Interface';

const markAsSeenAll = (set, get) => () => {
  try {
    notificationApi.markAsSeenAll();
    const data: INotificationsState = get();

    const notifications: any = cloneDeep(data.notificationList) || {};

    Object.keys(notifications).forEach((key) => {
      notifications[key] = { ...notifications[key], isSeen: true };
    });

    set((state: INotificationsState) => {
      state.unseenNumber = 0;
      state.notificationList = { ...notifications };
    }, 'loadMoreNotification');
  } catch (err) {
    console.error(
      '\x1b[33m', 'notification markAsSeenAll error', err, '\x1b[0m',
    );
    showError(err);
  }
};

export default markAsSeenAll;
