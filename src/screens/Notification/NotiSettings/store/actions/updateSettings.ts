import notificationApi from '~/api/NotificationApi';
import { INotiSettingsStore } from '../index';
import { IEditNotificationSetting, INotiSettings } from '~/interfaces/INotification';

const updateSettings = (set, get) => async (
  params: IEditNotificationSetting,
  dataUpdateStore: INotiSettings,
) => {
  const { data } = get();
  if (!Boolean(data?.[dataUpdateStore?.name])) {
    return;
  }

  try {
    set((state: INotiSettingsStore) => {
      state.loadingUpdate = true;
    }, 'updateSettingsLoading');

    await notificationApi.updateSettings(params);
    set((state: INotiSettingsStore) => {
      state.loadingUpdate = false;
      state.data[dataUpdateStore.name] = { ...data[dataUpdateStore.name], ...dataUpdateStore };
    }, 'updateSettingsSuccess');
  } catch (err) {
    console.error(
      '\x1b[33m', 'update notification settings error', err, '\x1b[0m',
    );
    set((state: INotiSettingsStore) => {
      state.loadingUpdate = false;
    }, 'updateSettingsError');
  }
};

export default updateSettings;
