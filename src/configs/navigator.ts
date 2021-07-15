export const rootSwitch = {
  mainStack: 'MainStack',
  authStack: 'AuthStack',
  appLoading: 'AppLoading',
};

export const mainStack = {
  // drawer: 'Drawer',
  bottomTabs: 'BottomTabs',
  conversationList: 'ConversationsList',
  conversation: 'Conversation',
  conversationDetail: 'ConversationDetail',
  reply: 'CommentDetail',
  createPost: 'CreatePost',
};

export const authStack = {
  landing: 'Landing',
  login: 'SignIn',
  signup: 'SignUp',
  forgotPassword: 'ForgotPassword',
};

export const homeStack = {
  home: 'Home',
  postDetail: 'PostDetail',
};

export const groupTabs = {
  subscription: 'Subscription',
  discovery: 'Discovery',
  myGroups: 'MyGroups',
};

export const bottomTabs = {
  home: homeStack,
  groups: groupTabs,
  chat: 'Chat',
  notification: 'Notification',
  menu: 'Menu',
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
      name: {
        vi: 'Tin mới',
        en: 'News Feed',
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
      name: {
        vi: 'Nhóm',
        en: 'Groups',
      },
      screen: bottomTabs.groups.subscription,
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
        en: 'Chat',
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
      name: {
        vi: 'Thông báo',
        en: 'Notifications',
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
      name: {
        vi: 'Cài đặt',
        en: 'Menu',
      },
      screen: bottomTabs.menu,
      option: {
        tabBarIcon: 'iconMenu',
      },
    },
  ],
};

export const groupTabsSetting = {
  configs: {
    initialRouteName: groupTabs.subscription,
  },
  tabsNavigator: [
    {
      title: {
        vi: '',
        en: '',
      },
      name: {
        vi: 'Đã tham gia',
        en: 'Subscription',
      },
      screen: groupTabs.subscription,
      option: {
        tabBarIcon: '',
      },
    },
    {
      title: {
        vi: '',
        en: '',
      },
      name: {
        vi: 'Khám phá',
        en: 'Discovery',
      },
      screen: groupTabs.discovery,
      option: {
        tabBarIcon: '',
      },
    },
    {
      title: {
        vi: '',
        en: '',
      },
      name: {
        vi: 'Của tôi',
        en: 'My groups',
      },
      screen: groupTabs.myGroups,
      option: {
        tabBarIcon: '',
      },
    },
  ],
};
