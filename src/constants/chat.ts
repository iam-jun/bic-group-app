import {getEnv} from '~/utils/env';

const CHANNELS = getEnv('BEIN_CHAT_DEEPLINK') + 'channels';

const DIRECT_MESSAGE = getEnv('BEIN_CHAT_DEEPLINK') + 'messages';

const PREFIX_DEEPLINK = 'beinchat://';

const PREFIX_HTTPS = 'https://';

export const chatSchemes = {
  CHANNELS,
  DIRECT_MESSAGE,
  PREFIX_DEEPLINK,
  PREFIX_HTTPS,
};
