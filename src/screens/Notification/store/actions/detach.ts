import INotificationsState from '../Interface';

const detach = (set, get) => (payload: any) => {
  const data: INotificationsState = get();

  const newNotificationList: any = { ...data };
  const removeDetachNoti = (value: string) => newNotificationList[
    value
  ]?.data?.filter?.((item: any) => item !== payload?.id) || [];

  const tabAllData = removeDetachNoti('tabAll');
  const tabUnreadData = removeDetachNoti('tabUnread');
  const tabMentionData = removeDetachNoti('tabMention');
  const tabImportantData = removeDetachNoti('tabImportant');

  set((state: INotificationsState) => {
    state.tabAll.data = tabAllData;
    state.tabImportant.data = tabImportantData;
    state.tabMention.data = tabMentionData;
    state.tabUnread.data = tabUnreadData;
    state.unseenNumber = Math.max(state.unseenNumber - 1, 0);
  }, 'detachNotification');
};

export default detach;
