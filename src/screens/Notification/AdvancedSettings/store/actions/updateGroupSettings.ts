import notificationApi from '~/api/NotificationApi';
import { IAdvancedNotiSettingsStore } from '../index';
import { IEditNotificationSetting, IGroupNotificationSetting } from '~/interfaces/INotification';

const updateGroupSettings = (set, _get) => async (
  params: IEditNotificationSetting,
  dataUpdateStore: IGroupNotificationSetting,
  isResetOrEnableSettings?: boolean,
) => {
  try {
    const { id, communityId } = dataUpdateStore;
    set((state: IAdvancedNotiSettingsStore) => {
      state.isUpdatingGroupSettings = true;
      state.isResetOrEnableGroupSettings = isResetOrEnableSettings;
    }, 'updateGroupSettingsLoading');

    await notificationApi.updateGroupSettings(communityId, id, params);

    set((state: IAdvancedNotiSettingsStore) => {
      state.isUpdatingGroupSettings = false;
      state.groupData = { ...state.groupData, [id]: dataUpdateStore };
      state.isResetOrEnableGroupSettings = false;
    }, 'updateGroupSettingsSuccess');
  } catch (err) {
    console.error(
      '\x1b[33m', 'update group advanced notification settings error', err, '\x1b[0m',
    );
    set((state: IAdvancedNotiSettingsStore) => {
      state.isUpdatingGroupSettings = false;
      state.isResetOrEnableGroupSettings = false;
    }, 'updateGroupSettingsError');
  }
};

export default updateGroupSettings;
