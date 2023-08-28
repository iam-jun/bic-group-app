import notificationApi from '~/api/NotificationApi';

const generateAdvancedSettings = (_set, _get) => async () => {
  try {
    await notificationApi.generateAdvancedSettings();
  } catch (err) {
    console.error(
      '\x1b[33m', 'generate advanced settings error', err, '\x1b[0m',
    );
  }
};

export default generateAdvancedSettings;
