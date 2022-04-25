import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect} from 'react';
import {
  DeviceEventEmitter,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useUserIdAuth} from '~/hooks/auth';
import useNotificationSocket from '~/hooks/notificationSocket';
import BaseStackNavigator from '~/router/components/BaseStackNavigator';
import BottomTabBar from '~/router/components/BottomTabBar';
import mainTabStack from '~/router/navigator/MainStack/MainTabs/stack';
import notificationsActions from '~/screens/Notification/redux/actions';
import postActions from '~/screens/Post/redux/actions';
import {initPushTokenMessage} from '~/services/helper';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {createSideTabNavigator} from '../../../components/SideTabNavigator';
import {screens, screensWebLaptop} from './screens';
import {useChatSocket} from '~/hooks/chat';

const BottomTab = createBottomTabNavigator();
const SideTab = createSideTabNavigator();

const MainTabs = () => {
  const theme: ITheme = useTheme() as ITheme;

  const backBehavior = 'history';

  useChatSocket();
  useNotificationSocket();

  const dimensions = useWindowDimensions();
  const isPhone = dimensions.width < deviceDimensions.smallTablet;
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  const Tab = isPhone ? BottomTab : SideTab;

  const styles = createStyles(theme, isPhone, isLaptop);

  const dispatch = useDispatch();

  const userId = useUserIdAuth();

  useEffect(() => {
    let tokenRefreshSubscription: any;

    // only valid if user logged in
    if (!userId) {
      return;
    }

    dispatch(postActions.getDraftPosts({}));
    if (Platform.OS !== 'web') {
      dispatch(notificationsActions.registerPushToken());
      initPushTokenMessage()
        .then(messaging => {
          tokenRefreshSubscription = messaging().onTokenRefresh(
            (token: string) =>
              dispatch(notificationsActions.registerPushToken({token})),
          );
        })
        .catch(e =>
          console.log('error when delete push token at auth stack', e),
        );
      // @ts-ignore
    }
    return () => {
      tokenRefreshSubscription && tokenRefreshSubscription();
    };
  }, [userId]);

  useNotificationSocket();

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
