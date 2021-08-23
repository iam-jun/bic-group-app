import React, {useEffect, useContext} from 'react';
import {useDispatch} from 'react-redux';

import {useTheme} from 'react-native-paper';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import i18next from 'i18next';

import Icon from '~/beinComponents/Icon';

import {createSideTabNavigator} from '../../../components/SideTabNavigator';
import {useWindowDimensions, View, StyleSheet} from 'react-native';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {screens} from './screens';
import {bottomTabIcons, bottomTabIconsFocused} from '~/configs/navigator';
import {Text} from '~/components';
import useTabBadge from '~/hooks/tabBadge';

import {AppContext} from '~/contexts/AppContext';
import notificationsActions from '../../../../screens/Notification/redux/actions';
import useNotifications from '~/hooks/notifications';
import {useUserIdAuth} from '~/hooks/auth';
import {subscribeGetstreamFeed} from '~/services/httpApiRequest';

const BottomTab = createBottomTabNavigator();
const SideTab = createSideTabNavigator();

const MainTabs = () => {
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;

  const backBehavior = 'history';

  // const {activeColor, inactiveColor, tabBarBackground} = colors;

  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const isPhone = dimensions.width < deviceDimensions.smallTablet;
  const isBigTablet = dimensions.width >= deviceDimensions.bigTablet;

  const Tab = isPhone ? BottomTab : SideTab;

  const styles = createStyles(theme, isPhone, isBigTablet);
  const tabBadge = useTabBadge();

  const dispatch = useDispatch();
  const notificationData = useNotifications();

  const {streamClient} = useContext(AppContext);

  const userId = useUserIdAuth();
  useEffect(() => {
    dispatch(
      notificationsActions.getNotifications({
        streamClient,
        userId: userId.toString(),
      }),
    );
  }, []);

  // callback function when client receive realtime activity in notification feed
  // load notifications again to get new unseen number (maybe increase maybe not if new activity is grouped)
  // with this, we also not to load notification again when access Notification screen
  const realtimeCallback = () => {
    dispatch(
      notificationsActions.getNotifications({
        streamClient,
        userId: userId.toString(),
      }),
    );
  };

  const {streamNotiSubClient} = useContext(AppContext);
  useEffect(() => {
    subscribeGetstreamFeed(
      streamNotiSubClient,
      'notification',
      'u-' + userId,
      realtimeCallback,
    );
  }, []);

  // render badget function
  const getBadgetNumber = name => {
    let number = 0;
    switch (name) {
      case 'notification':
        number = notificationData.unseenNumber;
        break;
      // implement other badget number here
      default:
        break;
    }

    if (number > 0) {
      return number >= 100 ? '99+' : number;
    } else {
      return undefined;
    }
  };

  return (
    // @ts-ignore
    <Tab.Navigator
      backBehavior={backBehavior}
      tabBarOptions={{
        // activeTintColor: activeColor,
        // inactiveTintColor: inactiveColor,
        keyboardHidesTabBar: true,
        activeTintColor: colors.primary7,
        inactiveTintColor: colors.textSecondary,
        activeBackgroundColor: colors.bgButtonSecondary,
        style: {
          backgroundColor: colors.background,
          height: 60 + (!isPhone ? 0 : insets.bottom),
        },
      }}
      tabBarStyle={styles.tabBar}>
      {Object.entries(screens).map(([name, component]) => {
        return (
          // @ts-ignore
          <Tab.Screen
            key={'tabs' + name}
            name={name}
            component={component}
            options={{
              tabBarIcon: ({focused, color}) => {
                if (isBigTablet) return null;

                const icon = focused ? bottomTabIconsFocused : bottomTabIcons;
                const styles = CreateStyle(theme, focused, isPhone, color);

                return (
                  <View style={styles.container}>
                    <Icon
                      //@ts-ignore
                      icon={icon[name]}
                      size={20}
                      tintColor="none"
                    />
                    {isPhone && (
                      <Text.Subtitle style={styles.label}>
                        {i18next.t(`tabs:${name}`)}
                      </Text.Subtitle>
                    )}
                  </View>
                );
              },
              tabBarLabel: () => null,
              tabBarBadge: tabBadge[name],
              tabBarBadgeStyle: {
                backgroundColor: tabBadge[name] > 0 ? '#EC2626' : 'transparent',
              },
              tabBarBadge: getBadgetNumber(name),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const CreateStyle = (
  theme: ITheme,
  focused: boolean,
  isPhone: boolean,
  color: string,
) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      height: isPhone ? '100%' : 64,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: focused ? colors.bgButtonSecondary : colors.background,
    },
    label: {
      color: color,
      textAlign: 'center',
    },
  });
};

const createStyles = (
  theme: ITheme,
  isPhone: boolean,
  isBigTablet: boolean,
) => {
  const {colors} = theme;
  return StyleSheet.create({
    tabBar: isPhone
      ? {}
      : {
          width: isBigTablet ? 0 : 64,
          backgroundColor: colors.background,
        },
  });
};

export default MainTabs;
