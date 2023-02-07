import { cloneDeep } from 'lodash';
import notificationApi from '~/api/NotificationApi';

import INotificationsState from '../Interface';
import showToastError from '~/store/helper/showToastError';
import showToast from '~/store/helper/showToast';

const markAsReadAll = (set, get) => (tabId: string) => {
  try {
    notificationApi.markAsReadAll(tabId);
    const data: INotificationsState = get();

    // get all notifications from store
    const notifications: any = cloneDeep(data.notificationList) || {};

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(notifications)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      notifications[key] = { ...((value as any) || {}), isRead: true };
    }

    // finally, set notification back to store,
    set((state: INotificationsState) => {
      state.tabUnread.data = [];
      state.tabUnread.noMoreData = true;
      state.tabUnread.loading = false;
      state.unseenNumber = 0;
      state.notificationList = { ...state.notificationList, ...notifications };
    }, 'markAsReadAllNotificationSuccess');

    showToast({
      content: 'notification:mark_all_as_read_success',
    });
  } catch (err) {
    console.error(
      '\x1b[33m', 'notification markAsReadAll error', err, '\x1b[0m',
    );
    showToastError(err);
  }
};

export default markAsReadAll;
