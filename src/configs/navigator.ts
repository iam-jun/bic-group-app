export const rootSwitch = {
  mainStack: 'MainStack',
  authStack: 'AuthStack',
  appLoading: 'AppLoading',
};

export const authStack = {
  landing: 'Landing',
  login: 'SignIn',
  signup: 'SignUp',
  forgotPassword: 'ForgotPassword',
};

export const homeStack = {
  home: 'home',
  postDetail: 'PostDetail',
};

export const groupsStack = {
  groups: 'Groups',
  groupDetail: 'GroupDetail',
};

export const menuStack = {
  menu: 'Menu',
  componentCollection: 'ComponentCollection',
};

export const bottomTabs = {
  home: homeStack,
  groups: groupsStack,
  chat: 'Chat',
  notification: 'Notification',
  menu: menuStack,
};

export const mainStack = {
  bottomTabs: 'BottomTabs',
  conversationList: 'ConversationsList',
  conversation: 'Conversation',
  conversationDetail: 'ConversationDetail',
  reply: 'CommentDetail',
  home: 'home',
  groups: 'groupTabs',
  chat: 'Chat',
  notification: 'Notification',
  menu: 'Menu',
  createPost: 'CreatePost',
  selectAudience: 'SelectAudience',
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
    {
      title: {
        vi: '',
        en: '',
      },
      router: mainStack.conversation,
      screen: mainStack.conversation,
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
      router: mainStack.conversationDetail,
      screen: mainStack.conversationDetail,
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
      router: mainStack.reply,
      screen: mainStack.reply,
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
      router: mainStack.createPost,
      screen: mainStack.createPost,
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
      router: mainStack.selectPostAudience,
      screen: mainStack.selectPostAudience,
      options: {
        headerShown: false,
        animationEnabled: true,
      },
    },
  ],
};

export const tabsSetting = {
  configs: {
    initialRouteName: bottomTabs.home.home,
  },
  tabsNavigator: [
    {
      title: {
        vi: '',
        en: '',
      },
      screen: bottomTabs.home.home,
      option: {
        tabBarIcon: 'iconHome',
      },
    },
    {
      title: {
        vi: '',
        en: '',
      },
      screen: bottomTabs.groups.groups,
      name: {
        vi: 'Nhóm',
        en: 'Groups',
      },
      option: {
        tabBarIcon: 'iconGroup',
      },
    },
    {
      title: {
        vi: '',
        en: '',
      },
      screen: bottomTabs.chat,
      option: {
        tabBarIcon: 'iconChat',
      },
    },
    {
      title: {
        vi: '',
        en: '',
      },
      screen: bottomTabs.notification,
      option: {
        tabBarIcon: 'iconNotification',
      },
    },
    {
      title: {
        vi: '',
        en: '',
      },
      screen: bottomTabs.menu.menu,
      name: {
        vi: 'Cài đặt',
        en: 'Menu',
      },
      option: {
        tabBarIcon: 'iconMenu',
      },
    },
  ],
};
