import * as Actions from './constants';

export const getConfigs = () => ({
  type: Actions.GET_CONFIGS,
});

export const setConfigs = () => ({
  type: Actions.SET_CONFIGS,
});

export const setupPushToken = () => ({
  type: Actions.SETUP_PUSH_TOKEN,
});

export const copyDeviceToken = () => ({
  type: Actions.COPY_DEVICE_TOKEN,
});
