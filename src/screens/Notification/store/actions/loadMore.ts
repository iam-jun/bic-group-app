import notificationApi from '~/api/NotificationApi';
import { IParamGetNotifications } from '~/interfaces/INotification';
import INotificationsState from '../Interface';

const loadMore = (set, get) => async (payload?: IParamGetNotifications) => {
  const { keyValue = 'tabAll' } = payload || {};
  try {
    set((state: INotificationsState) => {
      state[keyValue].isLoadingMore = true;
    }, 'loadMoreNotification');
    const data: INotificationsState = get();
    // get all notifications from store
    const notifications = data[keyValue].data;
    const offset = notifications?.length > 0 ? notifications.length : 0;

    const response = await
    notificationApi.getNotificationList(
      {
        offset,
        ...payload,
      },
    );

    if (response.results.length > 0) {
      const newData: any[] = [];
      const newResponse: any = {};
      response.results.forEach((item: any) => {
        newData.push(item?.id);
        newResponse[item.id] = { ...item };
      });

      set((state: INotificationsState) => {
        state[keyValue].isLoadingMore = false;
        state[keyValue].data = notifications.concat(newData);
        state.notificationList = { ...state.notificationList, ...newResponse };
      }, 'loadMoreNotificationSuccess');
    } else {
      set((state: INotificationsState) => {
        state[keyValue].noMoreData = true;
      }, 'loadMoreNotification');
    }
  } catch (err) {
    set((state: INotificationsState) => {
      state[keyValue].isLoadingMore = false;
    }, 'loadMoreNotificationError');
    console.error(
      '\x1b[33m', '--- load more : error', err, '\x1b[0m',
    );
  }
};

export default loadMore;
