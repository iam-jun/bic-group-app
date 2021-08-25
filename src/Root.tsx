import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  LogBox,
  NativeModules,
  Platform,
  StatusBar,
  useColorScheme,
} from 'react-native';

/* Theme */
import {
  configureFonts,
  DarkTheme,
  DefaultTheme,
  Portal,
  Provider as PaperProvider,
  Provider as ThemeProvider,
} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

/* State Redux */
import {useDispatch, useSelector} from 'react-redux';
import {fontConfig} from '~/configs/fonts';
import notificationsActions from '~/constants/notificationActions';
import {PreferencesContext} from '~/contexts/PreferencesContext';
import {useGetStream} from '~/hooks/getStream';
import RootNavigator from '~/router';
import localStorage from '~/services/localStorage';
import {setupPushToken} from '~/store/app/actions';
import {fetchSetting} from '~/store/modal/actions';

import {colors, dimension, fonts, shadow, spacing} from '~/theme';
import {AppConfig, languages} from './configs';
import moments from './configs/moments';
import {AppContext} from './contexts/AppContext';
import {useRootNavigation} from './hooks/navigation';
import {rootSwitch} from './router/stack';

moment.updateLocale('en', moments.en);
moment.updateLocale('vi', moments.vi);

export default (): React.ReactElement => {
  LogBox.ignoreAllLogs();

  const [stateCurrent, setState] = useState({isUpdate: false, loaded: false});

  /* Localization */
  const {i18n} = useTranslation();

  /*Declare redux and sagas*/
  const dispatch = useDispatch();
  // const language = useSelector(state => languageSelector(state));

  /* Theme Setup */
  const colorScheme = useColorScheme();
  const [theme, switchTheme] = React.useState<'light' | 'dark'>(
    colorScheme === 'dark' ? 'dark' : 'light',
  );

  // Init Get Stream
  const token = useSelector((state: any) => state.auth?.feed?.accessToken);
  const notiSubscribeToken = useSelector(
    (state: any) => state.auth?.feed?.notiSubscribeToken,
  );

  const streamClient = useGetStream(token);
  const streamNotiSubClient = useGetStream(notiSubscribeToken);

  const {rootNavigation} = useRootNavigation();

  useEffect(() => {
    if (colorScheme !== theme) toggleTheme();
  }, [colorScheme]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      theme,
    }),
    [theme],
  );

  useEffect(() => {
    setUpResource();
    setUpLanguage();
    listenFCMEvents();

    // TODO:
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('foreground', {remoteMessage});
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  const listenFCMEvents = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      handleInitialNotification(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        handleInitialNotification(remoteMessage);
      });
  };

  const handleInitialNotification = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  ) => {
    const data = handleMessageData(remoteMessage);
    if (data) rootNavigation.navigate(rootSwitch.mainStack, data);
  };

  const handleMessageData = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  ): {screen: any; params: any} | undefined => {
    if (!remoteMessage) return;

    try {
      //@ts-ignore
      let screen = notificationsActions[remoteMessage?.data?.type];
      const payload = remoteMessage?.data?.payload
        ? JSON.parse(remoteMessage?.data?.payload)
        : undefined;
      if (screen?.params)
        screen = {
          ...screen,
          params: {...screen.params, params: {...payload, initial: false}},
        };
      else screen = {...screen, params: {...payload, initial: false}};
      return screen;
    } catch (err) {
      return;
    }
  };

  /* Change language */
  const setUpLanguage = async () => {
    const language = await localStorage.getLanguage();
    if (language) {
      // @ts-ignore
      i18n.language !== language && i18n.changeLanguage(language);
    } else {
      let systemLocale =
        Platform.OS === 'ios'
          ? NativeModules.SettingsManager.settings.AppleLocale
          : NativeModules.I18nManager.localeIdentifier;

      if (systemLocale && systemLocale.includes('_'))
        systemLocale = systemLocale.split('_')[0];
      else if (systemLocale && systemLocale.includes('-'))
        systemLocale = systemLocale.split('-')[0];

      const isSupportLanguage = Object.keys(languages).find(
        (item: string) => item === systemLocale,
      );

      if (isSupportLanguage) changeLanguage(systemLocale);
      else changeLanguage(AppConfig.defaultLanguage);
    }
  };

  const changeLanguage = async (language: string) => {
    await i18n.changeLanguage(language);
    await localStorage.setLanguage(language);
  };

  const setUpResource = async () => {
    const stateNew = {
      isUpdate: false,
      loaded: false,
    };
    try {
      dispatch(setupPushToken());
      /*Fetch setting*/
      dispatch(fetchSetting());

      /*Set loading success*/
      stateNew.loaded = true;
      setState(stateNew);
    } catch (error) {
      console.error(`Setup error : ${error}`);
    }
  };

  const toggleTheme = () => {
    switchTheme((theme: string) => (theme === 'light' ? 'dark' : 'light'));
  };

  //Set config theme
  const themeConfig: any =
    theme === 'light'
      ? {
          ...DefaultTheme,
          colors: {...DefaultTheme.colors, ...colors.light.colors},
        }
      : {
          ...DarkTheme,
          colors: {...DarkTheme.colors, ...colors.dark.colors},
        };
  themeConfig.fontFamily = stateCurrent.loaded ? fonts : DefaultTheme.fonts;
  themeConfig.spacing = {...spacing};
  themeConfig.dimension = {...dimension};
  themeConfig.shadow = {...shadow};
  /*Config font*/
  themeConfig.fonts = configureFonts(fontConfig);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar
          // Dark mode has not ready yet
          // barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <PreferencesContext.Provider value={preferences}>
          <PaperProvider theme={themeConfig}>
            <AppContext.Provider
              value={{
                language: i18n.language,
                changeLanguage,
                streamClient,
                streamNotiSubClient,
              }}>
              <Portal.Host>
                <RootNavigator />
              </Portal.Host>
            </AppContext.Provider>
          </PaperProvider>
        </PreferencesContext.Provider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};
