import notificationApi from '~/api/NotificationApi';
import { INotiSettingsStore } from '../index';
import { INotiSettings } from '~/interfaces/INotification';

const getConfigSettings = (set, _get) => async () => {
  try {
    set((state: INotiSettingsStore) => {
      state.loading = true;
    }, 'getConfigSettingsLoading');

    const response = await notificationApi.getConfigSettings();
    if (response?.data?.length > 0) {
      const newData = {};
      response.data.forEach((item: INotiSettings) => {
        newData[item.name] = { ...item };
      });
      set((state: INotiSettingsStore) => {
        state.data = newData;
        state.loading = false;
      }, 'getConfigSettingsSuccess');
    }
  } catch (err) {
    console.error(
      '\x1b[33m', 'notification get notification settinsg error', err, '\x1b[0m',
    );
    set((state: INotiSettingsStore) => {
      state.loading = false;
    }, 'getConfigSettingsError');
  }
};

export default getConfigSettings;
