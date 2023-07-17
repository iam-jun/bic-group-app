import notificationApi from '~/api/NotificationApi';
import { IAdvancedNotiSettingsStore } from '../index';
import { IAdvancedNotificationSettings } from '~/interfaces/INotification';

const getGroupSettings = (set, get) => async (groupIds: string[]) => {
  try {
    if (groupIds?.length === 0) return;
    const communityId = get().selectedCommunity?.id;
    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingGroupSettings = true;
    }, 'getGroupSettingsLoading');

    const response = await notificationApi.getGroupSettings(communityId, groupIds);
    if (response?.data?.length > 0) {
      const newData = {};
      response.data.forEach((item: IAdvancedNotificationSettings) => {
        newData[item?.groupId] = { ...item };
      });
      set((state: IAdvancedNotiSettingsStore) => {
        state.isLoadingGroupSettings = false;
        state.groupData = { ...state.groupData, ...newData };
      }, 'getGroupSettingsSuccess');
    }
  } catch (err) {
    console.error(
      '\x1b[33m', 'notification get group advanced notification settings error', err, '\x1b[0m',
    );
    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingGroupSettings = false;
    }, 'getGroupSettingsError');
  }
};

export default getGroupSettings;
