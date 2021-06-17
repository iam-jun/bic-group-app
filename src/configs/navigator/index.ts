export const rootSwitch = {
  mainStack: 'MainStack',
  authStack: 'AuthStack',
  appLoading: 'AppLoading',
};

export const mainStack = {
  drawer: 'Drawer',
  bottomTabs: 'BottomTabs',
};

export const authStack = {
  login: 'SignIn',
  signup: 'SignUp',
  forgotpassword: 'ForgotPassword',
};

export const bottomTabs = {
  home: 'Home',
  vip: 'Vip',
  search: 'Search',
  groups: 'Groups',
  chat: 'Chat',
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
  configs: {
    initialRouteName: rootSwitch.appLoading,
  },
  stacks: [
    {
      title: {
        vi: '',
        en: '',
      },
      router: rootSwitch.mainStack,
      screen: rootSwitch.mainStack,
      options: {
        headerShown: false,
        animationEnabled: true,
      },
    },
    {
      title: {
        vi: '',
        en: '',
      },
      router: rootSwitch.authStack,
      screen: rootSwitch.authStack,
      options: {
        headerShown: false,
        animationEnabled: true,
      },
    },
    {
      title: {
        vi: '',
        en: '',
      },
      router: rootSwitch.appLoading,
      screen: rootSwitch.appLoading,
      options: {
        headerShown: false,
        animationEnabled: true,
      },
    },
  ],
};

export const tabsSetting = {
  configs: {
    initialRouteName: bottomTabs.home,
  },
  tabsNavigator: [
    {
      title: {
        vi: '',
        en: '',
      },
      name: {
        vi: 'Trang chủ',
        en: 'Home',
      },
      screen: bottomTabs.home,
      option: {
        tabBarIcon: 'iconHome',
      },
    },
    {
      title: {
        vi: '',
        en: '',
      },
      name: {
        vi: 'VIP',
        en: 'VIP',
      },
      screen: bottomTabs.vip,
      option: {
        tabBarIcon: 'iconDiamond',
      },
    },
    {
      title: {
        vi: '',
        en: '',
      },
      name: {
        vi: 'Tìm kiếm',
        en: 'Search',
      },
      screen: bottomTabs.groups,
      option: {
        tabBarIcon: 'iconSearchMT',
      },
    },
    {
      title: {
        vi: '',
        en: '',
      },
      name: {
        vi: 'Nhóm',
        en: 'Group',
      },
      screen: bottomTabs.groups,
      option: {
        tabBarIcon: 'iconGroup',
      },
    },
    {
      title: {
        vi: '',
        en: '',
      },
      name: {
        vi: 'Tin nhắn',
        en: 'Message',
      },
      screen: bottomTabs.groups,
      option: {
        tabBarIcon: 'iconChat',
      },
    },
  ],
};
