import { cloneDeep } from 'lodash';
import notificationApi from '~/api/NotificationApi';
import INotificationsState from '../Interface';

const markAsRead = (set, get) => (notificationId: string) => {
  try {
    if (!notificationId) return;
    const storeData: INotificationsState = get();

    notificationApi.markAsRead(notificationId);

    const notifications: any = cloneDeep(storeData.notificationList) || {};
    notifications[notificationId].isRead = true;

    const tabUnreadData: any[] = cloneDeep(storeData.tabUnread.data) || [];
    let newData = [] as any;
    if (tabUnreadData?.length > 0) {
      newData = tabUnreadData.filter((item: any) => item !== notificationId);
    }

    set((state: INotificationsState) => {
      state.tabUnread.data = newData;
      state.unseenNumber = 0;
      state.notificationList = { ...state.notificationList, ...notifications };
    }, 'loadMoreNotification');
  } catch (err) {
    console.error(
      '\x1b[33m', 'notification markAsRead error', err, '\x1b[0m',
    );
  }
};

export default markAsRead;
