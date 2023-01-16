import { GiphySDK } from '@giphy/react-native-sdk';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { AppState, DeviceEventEmitter } from 'react-native';
import { useUserIdAuth } from '~/hooks/auth';
import useChatSocket from '~/hooks/chat';
import useNotificationSocket from '~/hooks/notificationSocket';
import BottomTabBar from '~/router/components/BottomTabBar';
import { screens } from './screens';
import { initPushTokenMessage } from '~/services/firebase';
import useEmojiPickerStore from '~/baseComponents/EmojiPicker/store';
import IEmojiPickerState from '~/baseComponents/EmojiPicker/store/Interface';
import useGiphyStore, { IGiphyState } from '~/store/giphy';
import useNotificationStore from '~/screens/Notification/store';
import INotificationsState from '~/screens/Notification/store/Interface';
import useMyPermissionsStore from '~/store/permissions';
import useAuthController from '~/screens/auth/store';
import { getAuthToken } from '~/screens/auth/store/selectors';
import { getUserFromSharedPreferences, isAppInstalled } from '~/services/sharePreferences';

const BottomTab = createBottomTabNavigator();

const PERMISSION_EXPIRED_TIME = 1000 * 60 * 10; // 10 mins

const MainTabs = () => {
  const backBehavior = 'history';

  useChatSocket();
  useNotificationSocket();

  const actions = useEmojiPickerStore((state: IEmojiPickerState) => state.actions);

  const userId = useUserIdAuth();
  const token = useAuthController(getAuthToken);
  const giphyAPIKey = useGiphyStore((state: IGiphyState) => state.apiKey);
  const giphyActions = useGiphyStore((state: IGiphyState) => state.actions);
  const notiActions = useNotificationStore((state: INotificationsState) => state.actions);
  const myPermissionActions = useMyPermissionsStore((state) => state.actions);

  useEffect(
    () => {
      let tokenRefreshSubscription: any;

      // only valid if user logged in
      if (!userId) {
        return;
      }
      actions.buildEmojis();
      giphyActions.getAPIKey();
      notiActions.registerPushToken();
      initPushTokenMessage()
        .then((messaging) => {
          tokenRefreshSubscription = messaging()
            .onTokenRefresh((token: string) => notiActions.registerPushToken({ token }));
        })
        .catch((e) => console.error(
          'error when delete push token at auth stack', e,
        ));

      const appStateChangeEvent = AppState.addEventListener(
        'change',
        checkAuthSessions,
      );

      return () => {
        appStateChangeEvent.remove();
        tokenRefreshSubscription && tokenRefreshSubscription();
      };
    }, [userId],
  );

  useEffect(
    () => {
    // Configure GiphySDK API keys
      GiphySDK.configure({
        apiKey: giphyAPIKey,
      });
    }, [giphyAPIKey],
  );

  useEffect(() => {
    // For app start
    getMyPermissions();

    // For interval call
    const interval = setInterval(() => {
      getMyPermissions();
    }, PERMISSION_EXPIRED_TIME);

    return () => {
      clearInterval(interval);
    };
  }, [token, userId]);

  const checkAuthSessions = async () => {
    const isInstalled = await isAppInstalled();
    const user = await getUserFromSharedPreferences();
    if (isInstalled && !user) {
      useAuthController.getState().actions.signOut();
    }
  };

  const getMyPermissions = () => {
    if (!token || !userId) return;
    myPermissionActions.getMyPermissions();
  };

  return (
    <BottomTab.Navigator
      backBehavior={backBehavior}
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      {Object.entries(screens).map(([name, component]) => (
        <BottomTab.Screen
          key={`tabs${name}`}
          name={name}
          component={component}
          listeners={{
            tabPress: () => DeviceEventEmitter.emit(
              'onTabPress', name,
            ),
          }}
        />
      ))}
    </BottomTab.Navigator>
  );
};

export default MainTabs;
