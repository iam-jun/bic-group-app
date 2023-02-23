import { cloneDeep } from 'lodash';
import INotificationsState from '../Interface';

const update = (set, get) => (payload: any) => {
  const data: INotificationsState = get();

  const newNotifications = cloneDeep(data.notificationList);
  let newUnSeenNumber = data.unseenNumber;
  if (newNotifications[payload.id]?.isSeen) {
    newUnSeenNumber += 1;
  }

  newNotifications[payload.id] = { ...payload };

  set((state: INotificationsState) => {
    state.notificationList = { ...newNotifications };
    state.unseenNumber = newUnSeenNumber;
  }, 'updateNotification');
};

export default update;
