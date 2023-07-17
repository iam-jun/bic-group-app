import notificationApi from '~/api/NotificationApi';
import { IAdvancedNotiSettingsStore } from '../index';
import { IAdvancedNotificationSettings, IEditNotificationSetting } from '~/interfaces/INotification';

const updateGroupSettings = (set, _get) => async (
  params: IEditNotificationSetting,
  dataUpdateStore: IAdvancedNotificationSettings,
) => {
  try {
    const { groupId, communityId } = dataUpdateStore;
    set((state: IAdvancedNotiSettingsStore) => {
      state.isUpdatingGroupSettings = true;
    }, 'updateGroupSettingsLoading');

    await notificationApi.updateGroupSettings(communityId, groupId, params);

    set((state: IAdvancedNotiSettingsStore) => {
      state.isUpdatingGroupSettings = false;
      state.groupData = { ...state.groupData, [groupId]: dataUpdateStore };
    }, 'updateGroupSettingsSuccess');
  } catch (err) {
    console.error(
      '\x1b[33m', 'update group advanced notification settings error', err, '\x1b[0m',
    );
    set((state: IAdvancedNotiSettingsStore) => {
      state.isUpdatingGroupSettings = false;
    }, 'updateGroupSettingsError');
  }
};

export default updateGroupSettings;
