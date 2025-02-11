import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import moment from 'moment';
import 'moment/locale/vi';

import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LogBox, NativeModules, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useAuthController from '~/screens/auth/store';

/* State Redux */
import moments from './configs/moments';
import { AppContext } from './contexts/AppContext';
import { useRootNavigation } from './hooks/navigation';
import { IUserResponse } from './interfaces/IAuth';

import RootNavigator from '~/router';
import { getScreenAndParams, isNavigationRefReady } from '~/router/helper';
import { initFontAwesomeIcon } from '~/services/fontAwesomeIcon';
import localStorage from '~/services/localStorage';
import { parseSafe } from './utils/common';
import useMaintenanceStore from './store/maintenance';
import groupStack from './router/navigator/MainStack/stacks/groupStack/stack';

moment.updateLocale(
  'en', moments.en,
);
moment.updateLocale(
  'vi', moments.vi,
);

initFontAwesomeIcon();

const Root = (): React.ReactElement => {
  LogBox.ignoreAllLogs();

  /* Localization */
  const { i18n } = useTranslation();

  const { rootNavigation } = useRootNavigation();

  useEffect(
    () => {
      if (i18n?.language) {
        moment.locale(i18n?.language);
      }
    }, [i18n?.language],
  );

  useEffect(
    () => {
      setUpLanguage();
      listenFCMEvents();

      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        console.warn(
          'foreground', { remoteMessage },
        );
      });

      return () => {
        unsubscribe?.();
      };
    }, [],
  );

  const listenFCMEvents = () => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      handleInitialNotification(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        handleInitialNotification(remoteMessage);
      });
  };

  const handleInitialNotification = (remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
    if (!isNavigationRefReady?.current) {
      // On low performance device, retry until navigation ready
      setTimeout(
        () => {
          handleInitialNotification(remoteMessage);
        }, 2000,
      );
      return;
    }

    // Do not call user outside this scope, as it will get outdated value
    const user: IUserResponse = useAuthController?.getState?.()?.authUser;
    if (!user) return;

    const data = handleMessageData(remoteMessage);

    if (data) {
      if (data.screen === groupStack.groupDetail || data.screen === groupStack.communityDetail) {
        rootNavigation.push(data.screen, {
          ...(data?.params || {}),
          initial: false,
        });
      } else {
        rootNavigation.navigate(data.screen || 'main', {
          ...(data?.params || {}),
          initial: false,
        });
      }
    }
  };

  const handleMessageData = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  ): { screen: string; params: any } | null => {
    if (!remoteMessage) return null;

    const data = remoteMessage?.data?.extraData;
    const newData = typeof data === 'string' ? parseSafe(data) : {};

    if (newData?.startAt && newData?.duration) {
      useMaintenanceStore.getState().actions.checkMaintenance();
    }

    return getScreenAndParams(newData);
  };

  /* Change language */
  const setUpLanguage = async () => {
    const language = await localStorage.getLanguage();
    if (language) {
      if (i18n.language !== language) {
        /**
         * Temporarily hidden language in task BEIN-13338
         */
        // i18n.changeLanguage(language);
        i18n.changeLanguage('en');
      }
      moment.locale(language);
    } else {
      let systemLocale = Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale
        : NativeModules.I18nManager.localeIdentifier;

      // eslint-disable-next-line prefer-destructuring
      if (systemLocale && systemLocale.includes('_')) systemLocale = systemLocale.split('_')[0];
      // eslint-disable-next-line prefer-destructuring
      else if (systemLocale && systemLocale.includes('-')) systemLocale = systemLocale.split('-')[0];

      /**
       * Temporarily hidden language in task BEIN-13338
       * import { AppConfig, languages } from './configs';
       */
      // const isSupportLanguage = Object.keys(languages).find((item: string) => item === systemLocale);
      // const newLanguage = isSupportLanguage ? systemLocale : AppConfig.defaultLanguage;
      const newLanguage = 'en';

      changeLanguage(newLanguage);
      moment.locale(newLanguage);
    }
  };

  const changeLanguage = async (language: string) => {
    await i18n.changeLanguage(language);
    await localStorage.setLanguage(language);
  };

  const providerValue = useMemo(
    () => ({
      language: i18n.language,
      changeLanguage,
    }), [i18n.language],
  );

  return (
    <SafeAreaProvider>
      <AppContext.Provider value={providerValue}>
        <RootNavigator />
      </AppContext.Provider>
    </SafeAreaProvider>
  );
};

export default Root;
