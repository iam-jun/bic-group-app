import notificationApi from '~/api/NotificationApi';
import { IAdvancedNotiSettingsStore } from '../index';
import { IAdvancedNotificationSettings } from '~/interfaces/INotification';

const getCommunitySettings = (set, _get) => async (communityId: string) => {
  try {
    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingCommunitySettings = true;
    }, 'getCommunitySettingsLoading');

    const response = await notificationApi.getCommunitySettings(communityId);
    if (response?.data?.length > 0) {
      const newData = {};
      response.data.forEach((item: IAdvancedNotificationSettings) => {
        newData[item.communityId] = { ...item };
      });
      set((state: IAdvancedNotiSettingsStore) => {
        state.isLoadingCommunitySettings = false;
        state.communityData = newData;
      }, 'getCommunitySettingsSuccess');
    }
  } catch (err) {
    console.error(
      '\x1b[33m', 'notification get advanced notification settings error', err, '\x1b[0m',
    );
    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingCommunitySettings = false;
    }, 'getCommunitySettingsError');
  }
};

export default getCommunitySettings;
