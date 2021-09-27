import {getEnv} from '~/utils/env';

export const authStack = {
  landing: 'Landing',
  login: 'SignIn',
  signup: 'SignUp',
  forgotPassword: 'ForgotPassword',
};

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
  groups: 'iconTabGroups',
  chat: 'iconTabChat',
  notification: 'iconTabNotification',
  menus: 'iconTabMenu',
};

export const bottomTabIconsFocused = {
  home: 'iconTabHomeBein',
  groups: 'iconTabGroupsBein',
  chat: 'iconTabChatBein',
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
  chat: 'chat',
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

  // Chat
  chatConversationList: 'conversation-list',
  chatConversation: 'conversation',
  chatConversationDetail: 'conversation-detail',
  chatCreateConversation: 'create-conversation',
  chatGroupMembers: 'chat-group-members',
  chatAddMembers: 'add-members',

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

  // Menu, settings
  menu: 'menu',
  settings: 'account-settings',
  settingAccount: 'user-edit',
  settingSecurityLogin: 'security-and-login',
  settingChangePassword: 'change-password',
  settingEditBasicInfo: 'edit-basic-info',
  userProfile: 'user-profile',

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
      // MainStack: {
      //   screens: {
      //     main: {
      //       screens: {
      //         home: {
      //           screens: {
      //             'post-detail': {
      //               path: 'post/t/:post_id?',
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
      NotFound: '*',
    },
  },
};

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
              chat: {
                screens: {
                  conversation: {
                    path: 'chat/:roomId?',
                  },
                  'conversation-detail': {
                    path: 'chat/:roomId/info',
                  },
                  'create-conversation': {
                    path: 'chat/create',
                  },
                  'chat-group-members': {
                    path: 'chat/:roomId/members',
                  },
                  'add-members': {
                    path: 'chat/:roomId/invite',
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

export const linkingConfigFullLaptop = {
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
              newsfeed: {
                path: 'newsfeed',
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
              'user-profile': {
                path: 'profile/:userId?',
              },
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
              'edit-group-description': {
                path: 'groups/:groupId/edit/description',
              },
              conversation: {
                path: 'chat/:roomId?',
              },
              'conversation-detail': {
                path: 'chat/:roomId/info',
              },
              'create-conversation': {
                path: 'chat/create',
              },
              'chat-group-members': {
                path: 'chat/:roomId/members',
              },
              'add-members': {
                path: 'chat/:roomId/invite',
              },
              'not-select-notification': {
                path: 'notifications',
              },
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
      NotFound: '*',
    },
  },
};
