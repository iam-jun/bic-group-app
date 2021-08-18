import * as Actions from './constants';
import {IHeaderFlashMessage} from '~/interfaces/common';

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

export const setHeaderFlashMessage = (payload: IHeaderFlashMessage) => ({
  type: Actions.SET_HEADER_FLASH_MESSAGE,
  payload,
});

export const clearHeaderFlashMessage = () => ({
  type: Actions.CLEAR_HEADER_FLASH_MESSAGE,
});

export const showHeaderFlashMessage = (payload: IHeaderFlashMessage) => ({
  type: Actions.SHOW_HEADER_FLASH_MESSAGE,
  payload,
});
