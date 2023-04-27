import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import getEnv from '~/utils/env';
import homeStack from './navigator/MainStack/stacks/homeStack/stack';

export const PREFIX_DEEPLINK_GROUP = 'bic://';

// added www because related to performance, auth,...
export const PREFIX_URL = 'https://www.';

export const customBackHandlerRoutes = [
  'home',
  'groups',
  'post-detail',
  'create-post',
  'MainStack',
  'group-scheme-assignment',
  'create-permission-scheme',
  articleStack.createArticleTitle,
  articleStack.createArticleSummary,
  articleStack.createArticleCategory,
  articleStack.createArticleAudience,
  articleStack.createArticleSeries,
  articleStack.createArticleTags,
  articleStack.createArticleContent,
  homeStack.createPostTags,
  homeStack.createPostSeries,
  homeStack.pinContent,
  homeStack.reorderedPinContent,
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
    __DEV__ ? 'http://localhost:8088' : `${PREFIX_URL}${getEnv('SELF_DOMAIN')}`,
    PREFIX_DEEPLINK_GROUP,
  ],
};
