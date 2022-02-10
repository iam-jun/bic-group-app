import {getEnv} from '~/utils/env';

export const chatSchemes = {
  CHANNELS: getEnv('BEIN_CHAT_DEEPLINK') + 'channels',
};
