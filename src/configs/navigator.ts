import {getEnv} from '~/utils/env';

export const authStack = {
  landing: 'Landing',
  login: 'SignIn',
  signup: 'SignUp',
  forgotPassword: 'ForgotPassword',
};

export const hideBottomTabRoutes = [
  //Post: Post Detail, Comment View
  'post-detail',
  'create-post',
  'create-comment',
  'comment-view',
  'add-members',
  'comment-detail',
  //Setting: Account setting, Edit account, Security, Privacy
  'user-edit',
  'user-profile',
  'security-and-login',
  // groups
  'general-info',
  'edit-group-description',
  'pending-members',
];

export const customBackHandlerRoutes = [
  'home',
  'groups',
  'post-detail',
  'create-post',
  'MainStack',
];

export const NAVIGATION_BACK_PRESSED = 'navigation-back-pressed';

export const navigationSetting = {
  defaultNavigationOption: {
    headerStyle: {
      borderBottomWidth: 0,
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.1,
      elevation: 2,
    },
    headerTitleStyle: {
      flex: 1,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: 'bold',
      justifyContent: 'space-between',
      textAlign: 'center',
    },
    cardStyle: {backgroundColor: '#fff'},
  },
};

export const bottomTabIcons = {
  home: 'iconTabHome',
  communities: 'iconTabCommunities',
  notification: 'iconTabNotification',
  menus: 'iconTabMenu',
};

export const bottomTabIconsFocused = {
  home: 'iconTabHomeBein',
  communities: 'iconTabCommunitiesBein',
  notification: 'iconTabNotificationBein',
  menus: 'iconTabMenuBein',
};

export const appScreens = {
  // Stacks
  mainStack: 'MainStack',
  authStack: 'AuthStack',
  notFound: 'NotFound',
  home: 'home',
  groups: 'groups',
  notification: 'notification',
  menus: 'menus',

  // Auth
  login: 'SignIn',
  signup: 'SignUp',
  forgotPassword: 'ForgotPassword',

  // Feed
  newsfeed: 'newsfeed',
  postDetail: 'post-detail',
  postCreate: 'create-post',
  postCreateComment: 'create-comment',
  postSelectImage: 'post-select-image',
  postSelectAudience: 'post-select-audience',
  draftPost: 'draft-post',
  postSettings: 'post-settings',

  // Group
  groupList: 'group-list',
  groupDetail: 'group-detail',
  groupMembers: 'group-members',
  groupAbout: 'group-about',
  groupFiles: 'group-files',
  groupAdmin: 'group-admin',
  groupGeneralInfo: 'general-info',
  groupEditDescription: 'edit-group-description',
  groupInviteMembers: 'invite-members',
  groupPendingMembers: 'pending-members',

  // Menu, settings
  menu: 'menu',
  settings: 'account-settings',
  settingAccount: 'user-edit',
  settingSecurityLogin: 'security-and-login',
  settingChangePassword: 'change-password',
  settingEditBasicInfo: 'edit-basic-info',
  settingEditContact: 'edit-contact',
  userProfile: 'user-profile',
  settingCreateWork: 'add-work',
  settingEditDescription: 'edit-description',

  // Notification
  notificationEmpty: 'not-select-notification',

  // Components
  componentCollection: 'component-collection',
};

export const linkingConfig = {
  prefixes: [
    __DEV__ ? 'http://localhost:8088' : getEnv('SELF_DOMAIN'),
    'bein://',
  ],
  config: {
    screens: {
      AuthStack: {
        screens: {
          Landing: {
            path: 'welcome',
          },
          SignIn: {
            path: 'login',
          },
          SignUp: {
            path: 'register',
          },
          ForgotPassword: {
            path: 'reset-password',
          },
        },
      },
    },
  },
};

// User logged in
export const linkingConfigFull = {
  prefixes: [
    __DEV__ ? 'http://localhost:8088' : getEnv('SELF_DOMAIN'),
    'bein://',
  ],
  config: {
    screens: {
      AuthStack: {
        screens: {
          Landing: {
            path: 'welcome',
          },
          SignIn: {
            path: 'login',
          },
          SignUp: {
            path: 'register',
          },
          ForgotPassword: {
            path: 'reset-password',
          },
        },
      },
      MainStack: {
        screens: {
          main: {
            screens: {
              home: {
                screens: {
                  newsfeed: {
                    path: 'newsfeed',
                  },
                  'draft-post': {
                    path: 'draft-post',
                  },
                  'post-detail': {
                    path: 'post/t/:post_id?',
                  },
                  'create-post': {
                    path: 'post/create',
                  },
                  'post-select-audience': {
                    path: 'post/create/audiences',
                  },
                  'post-select-image': {
                    path: 'post/create/image',
                  },
                  'post-settings': {
                    path: 'post/create/settings',
                  },
                },
              },
              groups: {
                screens: {
                  'group-detail': {
                    path: 'groups/:groupId?',
                  },
                  'group-about': {
                    path: 'groups/:groupId/about',
                  },
                  'group-members': {
                    path: 'groups/:groupId/members',
                  },
                  'group-files': {
                    path: 'groups/:groupId/files',
                  },
                  'group-admin': {
                    path: 'groups/:groupId/admin',
                  },
                  'general-info': {
                    path: 'groups/:groupId/general-info',
                  },
                  'invite-members': {
                    path: 'groups/:groupId/invite',
                  },
                  'post-detail': {
                    path: 'groups/:groupId/post/:post_id?',
                  },
                  'edit-group-description': {
                    path: 'groups/:groupId/edit/description',
                  },
                },
              },
              notification: {
                screens: {
                  'not-select-notification': {
                    path: 'notifications',
                  },
                },
              },
              menus: {
                screens: {
                  'account-settings': {
                    path: 'settings',
                  },
                  'user-edit': {
                    path: 'settings/account',
                  },
                  'edit-basic-info': {
                    path: 'settings/account/edit',
                  },
                  'change-password': {
                    path: 'settings/security/change-password',
                  },
                  'security-and-login': {
                    path: 'settings/security',
                  },
                },
              },
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
