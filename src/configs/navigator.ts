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

export const linkingConfig = {
  prefixes: ['https://bein.group', 'bein://'],
  config: {
    screens: {
      AppLoading: {
        path: '',
      },
      AuthStack: {},
      MainStack: {
        screens: {
          main: {
            screens: {
              home: {
                path: 'home',
                screens: {
                  newsfeed: {
                    path: '',
                  },
                },
              },
              groups: {
                path: 'groups',
                screens: {
                  'group-list': {
                    path: '',
                  },
                  'group-detail': {
                    path: ':id?',
                  },
                },
              },
              chat: {
                path: 'chat',
                screens: {
                  'conversation-list': {
                    path: '',
                  },
                  conversation: {
                    path: ':id?',
                  },
                },
              },
              menus: {
                path: 'menus',
                screens: {
                  menu: {
                    path: '',
                  },
                  'component-collection': {
                    path: 'component-collection',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
