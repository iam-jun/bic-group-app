import notificationApi from '~/api/NotificationApi';
import { IParamGetNotifications } from '~/interfaces/INotification';
import INotificationsState from '../Interface';

const getNotifications = (set, _get) => async (payload?: IParamGetNotifications) => {
  const { keyValue = 'tabAll', isRefresh = false } = payload || {};
  try {
    set((state: INotificationsState) => {
      if (isRefresh) {
        state[keyValue].loading = true;
      } else {
        state[keyValue].loading = true;
      }
    }, 'getNotifications');
    const response = await notificationApi.getNotificationList(payload);

    if (response?.results?.length > 0) {
      const newData: any[] = [];
      const newResponse: any = {};
      response.results.forEach((item: any) => {
        newData.push(item?.id);
        newResponse[item.id] = { ...item };
      });
      set((state: INotificationsState) => {
        state[keyValue].loading = false;
        state[keyValue].data = [...newData];
        state.notificationList = { ...state.notificationList, ...newResponse };
        state.unseenNumber = response.unseen;
      }, 'getNotificationSuccess');
    } else {
      set((state: INotificationsState) => {
        state[keyValue].loading = false;
        state[keyValue].data = [];
        state[keyValue].noMoreData = true;
        state.unseenNumber = response.unseen;
      }, 'getNotificationWithNoNotiSuccess');
    }
  } catch (err) {
    set((state: INotificationsState) => {
      state[keyValue].loading = false;
    }, 'getNotificationError');
    console.error(
      '\x1b[31m🐣️ getNotifications err: ', err, '\x1b[0m',
    );
  }
};

export default getNotifications;
