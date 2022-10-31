import { cloneDeep } from 'lodash';
import notificationApi from '~/api/NotificationApi';

import * as modalActions from '~/storeRedux/modal/actions';
import INotificationsState from '../Interface';
import Store from '~/storeRedux';
import showError from '~/store/helper/showError';

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

    Store.store.dispatch(modalActions.showHideToastMessage({
      content: 'notification:mark_all_as_read_success',
    }));
  } catch (err) {
    console.error(
      '\x1b[33m', 'notification markAsReadAll error', err, '\x1b[0m',
    );
    showError(err);
  }
};

export default markAsReadAll;
