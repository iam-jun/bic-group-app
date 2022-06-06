import {GiphySDK} from '@giphy/react-native-sdk';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect} from 'react';
import {DeviceEventEmitter, useWindowDimensions} from 'react-native';
import {useDispatch} from 'react-redux';
import {useUserIdAuth} from '~/hooks/auth';
import {useChatSocket} from '~/hooks/chat';
import useNotificationSocket from '~/hooks/notificationSocket';
import {useKeySelector} from '~/hooks/selector';
import BottomTabBar from '~/router/components/BottomTabBar';
import groupsActions from '~/screens/Groups/redux/actions';
import notificationsActions from '~/screens/Notification/redux/actions';
import postActions from '~/screens/Post/redux/actions';
import {initPushTokenMessage} from '~/services/helper';
import giphyActions from '~/store/giphy/actions';
import {deviceDimensions} from '~/theme/dimension';
import {createSideTabNavigator} from '../../../components/SideTabNavigator';
import {screens} from './screens';

const BottomTab = createBottomTabNavigator();
const SideTab = createSideTabNavigator();

const MainTabs = () => {
  const backBehavior = 'history';

  useChatSocket();
  useNotificationSocket();

  const dimensions = useWindowDimensions();
  const isPhone = dimensions.width < deviceDimensions.smallTablet;

  const Tab = isPhone ? BottomTab : SideTab;

  const dispatch = useDispatch();

  const userId = useUserIdAuth();
  const giphyAPIKey = useKeySelector('giphy.APIKey');

  useEffect(() => {
    let tokenRefreshSubscription: any;

    // only valid if user logged in
    if (!userId) {
      return;
    }

    dispatch(postActions.getDraftPosts({}));
    dispatch(giphyActions.getAPIKey());
    dispatch(groupsActions.getMyCommunities());
    dispatch(notificationsActions.registerPushToken());
    initPushTokenMessage()
      .then(messaging => {
        tokenRefreshSubscription = messaging().onTokenRefresh((token: string) =>
          dispatch(notificationsActions.registerPushToken({token})),
        );
      })
      .catch(e => console.log('error when delete push token at auth stack', e));
    return () => {
      tokenRefreshSubscription && tokenRefreshSubscription();
    };
  }, [userId]);

  useEffect(() => {
    // Configure GiphySDK API keys
    GiphySDK.configure({
      apiKey: giphyAPIKey,
    });
  }, [giphyAPIKey]);

  return (
    // @ts-ignore
    <Tab.Navigator
      backBehavior={backBehavior}
      tabBar={props => <BottomTabBar {...props} />}>
      {Object.entries(screens).map(([name, component]) => {
        return (
          // @ts-ignore
          <Tab.Screen
            key={'tabs' + name}
            name={name}
            component={component}
            listeners={{
              tabPress: () => DeviceEventEmitter.emit('onTabPress', name),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default MainTabs;
