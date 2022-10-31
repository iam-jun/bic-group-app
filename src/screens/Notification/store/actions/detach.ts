import INotificationsState from '../Interface';

const detach = (set, get) => (payload: any) => {
  const data: INotificationsState = get();

  const newNotificationList: any = { ...data };
  const removeDetachNoti = (value: string) => {
    newNotificationList[value].data = newNotificationList[
      value
    ]?.data?.filter?.((item: any) => item !== payload?.id) || [];
  };
  removeDetachNoti('tabAll');
  removeDetachNoti('tabUnread');
  removeDetachNoti('tabMention');
  removeDetachNoti('tabImportant');

  set((state: INotificationsState) => {
    state.tabAll.data = newNotificationList.tabAll?.data;
    state.tabUnread.data = newNotificationList.tabUnread?.data;
    state.tabMention.data = newNotificationList.tabMention?.data;
    state.tabImportant.data = newNotificationList.tabImportant?.data;
    state.unseenNumber = Math.max(state.unseenNumber - 1, 0);
  }, 'detachNotification');
};

export default detach;
