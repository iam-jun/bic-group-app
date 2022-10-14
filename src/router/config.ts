import getEnv from '~/utils/env';

export const PREFIX_DEEPLINK_GROUP = 'bic://';

export const PREFIX_HTTPS = 'https://';

export const customBackHandlerRoutes = [
  'home',
  'groups',
  'post-detail',
  'create-post',
  'MainStack',
  'group-scheme-assignment',
  'create-permission-scheme',
  'edit-article',
];

export const EVENT_NAVIGATION_BACK_PRESSED = 'navigation-back-pressed';

export const bottomTabIcons = {
  home: 'iconTabHome',
  communities: 'iconTabCommunities',
  articles: 'iconTabArticle',
  notification: 'iconTabNotification',
  menus: 'iconTabMenu',
};

export const bottomTabIconsFocused = {
  home: 'iconTabHomeActive',
  communities: 'iconTabCommunitiesActive',
  articles: 'iconTabArticleActive',
  notification: 'iconTabNotificationActive',
  menus: 'iconTabMenuActive',
};

export const linkingConfig = {
  prefixes: [
    __DEV__ ? 'http://localhost:8088' : `${PREFIX_HTTPS}${getEnv('SELF_DOMAIN')}`,
    PREFIX_DEEPLINK_GROUP,
  ],
};
