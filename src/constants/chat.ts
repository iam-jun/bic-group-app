import getEnv from '~/utils/env';

const PREFIX_DEEPLINK = `${getEnv('CHAT_URL_SCHEME')}://`;
const CHAT_DOMAIN = `chat.${getEnv('SELF_DOMAIN')}`;
const FULL_DEEPLINK = `${PREFIX_DEEPLINK}chat.${getEnv('SELF_DOMAIN')}/`;

const PREFIX_HTTPS = 'https://';

const DEFAULT_CHANNEL = 'town-square';

export const chatSchemes = {
  PREFIX_DEEPLINK,
  CHAT_DOMAIN,
  PREFIX_HTTPS,
  DEFAULT_CHANNEL,
  FULL_DEEPLINK,
};
