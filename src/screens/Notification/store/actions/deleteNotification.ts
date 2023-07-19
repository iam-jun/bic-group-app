import { cloneDeep } from 'lodash';
import notificationApi from '~/api/NotificationApi';
import INotificationsState from '../Interface';
import showToastError from '~/store/helper/showToastError';

const deleteNotification = (set, get) => async (notificationId: string) => {
  try {
    if (!notificationId) return;
    const { waitingForDelete }: INotificationsState = get();
    const newWaitingForDelete = cloneDeep(waitingForDelete);
    const index = newWaitingForDelete?.indexOf(notificationId);
    if (index > -1) {
      newWaitingForDelete?.splice(index, 1);
    }

    await notificationApi.deleteNotification(notificationId);

    set((state: INotificationsState) => {
      state.waitingForDelete = [...newWaitingForDelete];
    }, 'deleteNotification');
  } catch (err) {
    console.error(
      '\x1b[33m', 'delete notification error', err, '\x1b[0m',
    );
    showToastError(err);
  }
};

export default deleteNotification;
