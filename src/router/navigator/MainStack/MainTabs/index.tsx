import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useContext, useEffect} from 'react';
import {
  DeviceEventEmitter,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {AppContext} from '~/contexts/AppContext';
import {useUserIdAuth} from '~/hooks/auth';
import BaseStackNavigator from '~/router/components/BaseStackNavigator';
import BottomTabBar from '~/router/components/BottomTabBar';
import mainTabStack from '~/router/navigator/MainStack/MainTabs/stack';
import {default as chatActions} from '~/screens/Chat/redux/actions';
import notificationsActions from '~/screens/Notification/redux/actions';
import postActions from '~/screens/Post/redux/actions';
import {subscribeGetstreamFeed} from '~/services/httpApiRequest';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {createSideTabNavigator} from '../../../components/SideTabNavigator';
import {screens, screensWebLaptop} from './screens';

const BottomTab = createBottomTabNavigator();
const SideTab = createSideTabNavigator();

const MainTabs = () => {
  const theme: ITheme = useTheme() as ITheme;

  const backBehavior = 'history';

  // const {activeColor, inactiveColor, tabBarBackground} = colors;

  // const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const isPhone = dimensions.width < deviceDimensions.smallTablet;
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  const Tab = isPhone ? BottomTab : SideTab;

  const styles = createStyles(theme, isPhone, isLaptop);

  const dispatch = useDispatch();

  const {streamClient, streamNotiSubClient} = useContext(AppContext);

  const userId = useUserIdAuth();
  useEffect(() => {
    dispatch(chatActions.initChat());
    dispatch(postActions.getDraftPosts({userId, streamClient}));
    if (streamClient?.currentUser?.token) {
      dispatch(
        notificationsActions.getNotifications({
          streamClient,
          userId: userId.toString(),
        }),
      );

      if (!streamNotiSubClient) {
        return;
      }

      const subscription = subscribeGetstreamFeed(
        streamNotiSubClient,
        'notification',
        'u-' + userId,
        realtimeCallback,
      );
      return () => {
        subscription && subscription.cancel();
      };
    }
  }, [streamClient]);

  // callback function when client receive realtime activity in notification feed
  // load notifications again to get new unseen number (maybe increase maybe not if new activity is grouped)
  // with this, we also not to load notification again when access Notification screen
  const realtimeCallback = (data: any) => {
    // for now realtime noti include "deleted" and "new"
    // for delete actitivity event "new" is empty
    // and we haven't handle "delete" event yet
    if (data.new.length > 0) {
      const actorId = data.new[0].actor.id;
      const notiGroupId = data.new[0].id;
      const limit = data.new.length;
      streamClient &&
        actorId != userId &&
        dispatch(
          notificationsActions.loadNewNotifications({
            streamClient,
            userId: userId.toString(),
            notiGroupId,
            limit: limit,
          }),
        );
    }
    if (data?.deleted?.length > 0) {
      streamClient &&
        dispatch(
          notificationsActions.deleteNotifications({
            streamClient,
            notiGroupIds: data.deleted,
            userId: userId.toString(),
          }),
        );
    }
  };

  const isWebLaptop = Platform.OS === 'web' && isLaptop;
  if (isWebLaptop) {
    return (
      <BaseStackNavigator stack={mainTabStack} screens={screensWebLaptop} />
    );
  }

  return (
    // @ts-ignore
    <Tab.Navigator
      backBehavior={backBehavior}
      tabBar={props => <BottomTabBar {...props} />}
      tabBarStyle={styles.tabBar}>
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

const createStyles = (theme: ITheme, isPhone: boolean, isLaptop: boolean) => {
  const {colors} = theme;
  return StyleSheet.create({
    tabBar: isPhone
      ? {}
      : {
          width: isLaptop ? 0 : 80,
          backgroundColor: colors.background,
        },
  });
};

export default MainTabs;
