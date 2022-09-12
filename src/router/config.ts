import getEnv from '~/utils/env';

export const PREFIX_DEEPLINK_GROUP = 'bic://';

export const WEB_SCHEME = 'https://';

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
    __DEV__ ? 'http://localhost:8088' : `${WEB_SCHEME}${getEnv('SELF_DOMAIN')}`,
    PREFIX_DEEPLINK_GROUP,
  ],
};
