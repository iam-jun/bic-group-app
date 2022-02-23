import {getEnv} from '~/utils/env';

export const chatSchemes = {
  CHANNELS: getEnv('BEIN_CHAT_DEEPLINK') + 'channels',
  DIRECT_MESSAGE: getEnv('BEIN_CHAT_DEEPLINK') + 'messages',
};
