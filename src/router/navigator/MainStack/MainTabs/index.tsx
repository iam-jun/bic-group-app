import { GiphySDK } from '@giphy/react-native-sdk';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useDispatch } from 'react-redux';
import { useUserIdAuth } from '~/hooks/auth';
import useChatSocket from '~/hooks/chat';
import useNotificationSocket from '~/hooks/notificationSocket';
import BottomTabBar from '~/router/components/BottomTabBar';
import groupsActions from '~/storeRedux/groups/actions';
import { screens } from './screens';
import { initPushTokenMessage } from '~/services/firebase';
import useEmojiPickerStore from '~/baseComponents/EmojiPicker/store';
import IEmojiPickerState from '~/baseComponents/EmojiPicker/store/Interface';
import useGiphyStore, { IGiphyState } from '~/store/giphy';
import useNotificationStore from '~/screens/Notification/store';
import INotificationsState from '~/screens/Notification/store/Interface';

const BottomTab = createBottomTabNavigator();

const MainTabs = () => {
  const backBehavior = 'history';

  useChatSocket();
  useNotificationSocket();

  const dispatch = useDispatch();
  const actions = useEmojiPickerStore((state: IEmojiPickerState) => state.actions);

  const userId = useUserIdAuth();
  const giphyAPIKey = useGiphyStore((state: IGiphyState) => state.apiKey);
  const giphyActions = useGiphyStore((state: IGiphyState) => state.actions);
  const notiActions = useNotificationStore((state: INotificationsState) => state.actions);

  useEffect(
    () => {
      let tokenRefreshSubscription: any;

      // only valid if user logged in
      if (!userId) {
        return;
      }
      actions.buildEmojis();
      dispatch(groupsActions.getMyPermissions());
      giphyActions.getAPIKey();
      dispatch(groupsActions.getMyCommunities({ refreshNoLoading: true }));
      notiActions.registerPushToken();
      initPushTokenMessage()
        .then((messaging) => {
          tokenRefreshSubscription = messaging()
            .onTokenRefresh((token: string) => notiActions.registerPushToken({ token }));
        })
        .catch((e) => console.error(
          'error when delete push token at auth stack', e,
        ));
      return () => {
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
