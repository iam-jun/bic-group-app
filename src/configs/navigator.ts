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
  menu: 'iconTabMenu',
};

export const linkingConfig = {
  prefixes: ['https://bein.group', 'bein://'],
  config: {
    screens: {
      AuthStack: {},
      MainStack: {
        path: '',
        screens: {
          main: {
            path: '',
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
                path: '',
                screens: {
                  groups: {
                    path: '',
                  },
                  group: {
                    path: 'groups',
                  },
                },
              },
            },
          },
          conversation: {
            path: 'chat',
          },
        },
      },
    },
  },
};
