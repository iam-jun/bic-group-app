import notificationApi from '~/api/NotificationApi';
import { IAdvancedNotiSettingsStore } from '../index';
import { IAdvancedNotificationSettings, IEditNotificationSetting } from '~/interfaces/INotification';

const updateCommunitySettings = (set, _get) => async (
  params: IEditNotificationSetting,
  dataUpdateStore: IAdvancedNotificationSettings,
) => {
  try {
    const { id: communityId } = dataUpdateStore;
    set((state: IAdvancedNotiSettingsStore) => {
      state.isUpdatingCommunitySettings = true;
    }, 'updateCommunitySettingsLoading');

    await notificationApi.updateCommunitySettings(communityId, params);

    set((state: IAdvancedNotiSettingsStore) => {
      state.isUpdatingCommunitySettings = false;
      state.communityData = { ...state.communityData, [communityId]: dataUpdateStore };
      state.selectedCommunity = dataUpdateStore;
    }, 'updateCommunitySettingsSuccess');
  } catch (err) {
    console.error(
      '\x1b[33m', 'update communtiy advanced notification settings error', err, '\x1b[0m',
    );
    set((state: IAdvancedNotiSettingsStore) => {
      state.isUpdatingCommunitySettings = false;
    }, 'updateCommunitySettingsError');
  }
};

export default updateCommunitySettings;
