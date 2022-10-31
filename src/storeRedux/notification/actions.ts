import notificationsTypes from '~/storeRedux/notification/types';

const notificationsActions = {
  registerPushToken: (payload?: any) => ({
    type: notificationsTypes.REGISTER_PUSH_TOKEN,
    payload,
  }),
  savePushToken: (payload: string) => ({
    type: notificationsTypes.SAVE_PUSH_TOKEN,
    payload,
  }),
};

export default notificationsActions;
