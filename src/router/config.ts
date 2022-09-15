import getEnv from '~/utils/env';

export const PREFIX_DEEPLINK_GROUP = 'bic://';

export const PREFIX_HTTPS = 'https://';

export const PREFIX_HTTPS_WWW = 'https://www.';

export const PREFIX_HTTP = 'http://';

export const BIC_GROUP_DOMAINS = {
  HTTPS: PREFIX_HTTPS + getEnv('SELF_DOMAIN'),
  HTTPS_WWW: PREFIX_HTTPS_WWW + getEnv('SELF_DOMAIN'),
  HTTP: PREFIX_HTTP + getEnv('SELF_DOMAIN'),
};

export const customBackHandlerRoutes = [
  'home',
  'groups',
  'post-detail',
  'create-post',
  'MainStack',
  'group-scheme-assignment',
  'create-permission-scheme',
];

export const EVENT_NAVIGATION_BACK_PRESSED = 'navigation-back-pressed';

export const bottomTabIcons = {
  home: 'iconTabHome',
  communities: 'iconTabCommunities',
  notification: 'iconTabNotification',
  menus: 'iconTabMenu',
};

export const bottomTabIconsFocused = {
  home: 'iconTabHomeActive',
  communities: 'iconTabCommunitiesActive',
  notification: 'iconTabNotificationActive',
  menus: 'iconTabMenuActive',
};

export const linkingConfig = {
  prefixes: [
    __DEV__ ? 'http://localhost:8088' : `${PREFIX_HTTPS}${getEnv('SELF_DOMAIN')}`,
    PREFIX_DEEPLINK_GROUP,
  ],
};
