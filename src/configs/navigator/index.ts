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
  login: 'Login',
  signup: 'SignUp',
  forgotpassword: 'ForgotPassword',
};

export const bottomTabs = {
  home: 'Home',
  more: 'More',
  vip: 'Vip',
  groups: 'Groups',
  notification: 'Notification',
  search: 'Search',
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
    initialRouteName: rootSwitch.authStack,
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
    light: {
      tabBarBackground: 'white',
      activeColor: '#368C8B',
      inactiveColor: '#200E32',
    },
    dark: {
      tabBarBackground: '#252D42',
      activeColor: '#F7F7F7',
      inactiveColor: '#a1a4b2',
    },
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
        tabBarIcon: 'HomeTab',
      },
    },
    {
      title: {
        vi: '',
        en: '',
      },
      name: {
        vi: 'Thêm nữa',
        en: 'More',
      },
      screen: bottomTabs.more,
      option: {
        tabBarIcon: 'MoreTab',
      },
    },
  ],
};
