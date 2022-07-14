import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import moment from 'moment';
import 'moment/locale/vi';

import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  LogBox,
  NativeModules,
  Platform,
  StatusBar,
  useColorScheme,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

/* State Redux */
import {useDispatch} from 'react-redux';
import {fontConfig} from '~/configs/fonts';
import notificationsActions from '~/constants/notificationActions';
import {PreferencesContext} from '~/contexts/PreferencesContext';
import RootNavigator from '~/router';
import localStorage from '~/services/localStorage';
import {fetchSetting} from '~/store/modal/actions';

import {colors, dimension, fonts, shadow, spacing} from '~/theme';
import {AppConfig, languages} from './configs';
import moments from './configs/moments';
import {AppContext} from './contexts/AppContext';
import {useRootNavigation} from './hooks/navigation';
import {rootSwitch} from './router/stack';
import Store from '~/store';
import {IUserResponse} from './interfaces/IAuth';
import {isNavigationRefReady, getScreenAndParams} from '~/router/helper';
import appTheme from './theme/theme';
import {DarkTheme, DefaultTheme} from '@react-navigation/native';
import {initFontAwesomeIcon} from '~/services/fontAwesomeIcon';

moment.updateLocale('en', moments.en);
moment.updateLocale('vi', moments.vi);

initFontAwesomeIcon();

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

  const {rootNavigation} = useRootNavigation();

  useEffect(() => {
    if (colorScheme !== theme) toggleTheme();
  }, [colorScheme]);

  useEffect(() => {
    if (i18n?.language) {
      moment.locale(i18n?.language);
    }
  }, [i18n?.language]);

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
    // Do not call user outside this scope, as it will get outdated value
    const user: IUserResponse | boolean = Store.getCurrentUser();

    if (!isNavigationRefReady?.current) {
      // On low performance device, retry until navigation ready
      setTimeout(() => {
        handleInitialNotification(remoteMessage);
      }, 2000);
      return;
    }

    if (!user) return;

    const data = handleMessageData(remoteMessage);

    if (data)
      rootNavigation.navigate(data.screen || rootSwitch.mainStack, {
        screen: data?.params?.screen || 'main',
        params: {
          ...(data?.params?.params || {}),
          initial: false,
        },
      });
  };

  const handleMessageData = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  ): {screen: any; params: any} | undefined => {
    if (!remoteMessage) return;

    try {
      const screenData = getScreenAndParams(remoteMessage?.data?.extraData);
      //@ts-ignore
      return screenData;
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
      moment.locale(language);
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

      const newLanguage = isSupportLanguage
        ? systemLocale
        : AppConfig.defaultLanguage;
      changeLanguage(newLanguage);
      moment.locale(newLanguage);
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
  const themeConfig: any = useMemo(() => {
    const result: any =
      theme === 'light'
        ? {
            ...DefaultTheme,
            colors: {...appTheme.light.colors},
          }
        : {
            ...DarkTheme,
            colors: {...appTheme.dark.colors},
          };
    // result.fontFamily = stateCurrent.loaded ? fonts : DefaultTheme.fonts;
    // result.spacing = {...spacing};
    // result.dimension = {...dimension};
    // result.shadow = {...shadow};
    /*Config font*/
    // result.fonts = configureFonts(fontConfig);
    return result;
  }, [theme, stateCurrent.loaded]);

  const providerValue = useMemo(() => {
    return {
      language: i18n.language,
      changeLanguage,
    };
  }, [i18n.language]);

  return (
    <SafeAreaProvider>
      <StatusBar
        // Dark mode has not ready yet
        // barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <PreferencesContext.Provider value={preferences}>
        <AppContext.Provider value={providerValue}>
          <RootNavigator />
        </AppContext.Provider>
      </PreferencesContext.Provider>
    </SafeAreaProvider>
  );
};
