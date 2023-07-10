import notificationApi from '~/api/NotificationApi';
import { INotiSettingsStore } from '../index';
import { INotiSettings } from '~/interfaces/INotification';

const getConfigSettings = (set, _get) => async (isRefreshing?: boolean) => {
  try {
    if (Boolean(isRefreshing)) {
      set((state: INotiSettingsStore) => {
        state.isRefreshing = true;
      }, 'refreshConfigSettings');
    } else {
      set((state: INotiSettingsStore) => {
        state.loading = true;
      }, 'getConfigSettingsLoading');
    }

    const response = await notificationApi.getConfigSettings();
    if (response?.data?.length > 0) {
      const newData = {};
      response.data.forEach((item: INotiSettings) => {
        newData[item.name] = { ...item };
      });
      set((state: INotiSettingsStore) => {
        state.data = newData;
        state.loading = false;
        state.isRefreshing = false;
      }, 'getConfigSettingsSuccess');
    } else {
      set((state: INotiSettingsStore) => {
        state.loading = false;
        state.isRefreshing = false;
      }, 'getConfigSettingsSuccessButNoData');
    }
  } catch (err) {
    console.error(
      '\x1b[33m', 'notification get notification settinsg error', err, '\x1b[0m',
    );
    set((state: INotiSettingsStore) => {
      state.loading = false;
      state.isRefreshing = false;
    }, 'getConfigSettingsError');
  }
};

export default getConfigSettings;
