import {ILinkPreview} from '~/interfaces/common';
import Actions from './constants';

export default {
  getConfigs: () => ({
    type: Actions.GET_CONFIGS,
  }),
  setConfigs: () => ({
    type: Actions.SET_CONFIGS,
  }),
  getLinkPreview: (payload: string) => ({
    type: Actions.GET_LINK_PREVIEW,
    payload,
  }),
  setLinkPreview: (payload: ILinkPreview) => ({
    type: Actions.SET_LINK_PREVIEW,
    payload,
  }),
  setRootScreenName: (payload: string) => ({
    type: Actions.SET_ROOT_SCREEN_NAME,
    payload,
  }),
  setDrawerVisible: (payload: boolean) => ({
    type: Actions.SET_DRAWER_VISIBLE,
    payload,
  }),
};

// export const setupPushToken = () => ({
//   type: Actions.SETUP_PUSH_TOKEN,
// });
//
// export const copyDeviceToken = () => ({
//   type: Actions.COPY_DEVICE_TOKEN,
// });
