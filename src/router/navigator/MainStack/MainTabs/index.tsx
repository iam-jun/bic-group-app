import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import i18next from 'i18next';
import React, {useContext, useEffect} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';

import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';

import Icon from '~/beinComponents/Icon';
import {Text} from '~/components';
import {bottomTabIcons, bottomTabIconsFocused} from '~/configs/navigator';

import {AppContext} from '~/contexts/AppContext';
import {useUserIdAuth} from '~/hooks/auth';
import useTabBadge from '~/hooks/tabBadge';
import {subscribeGetstreamFeed} from '~/services/httpApiRequest';
import {deviceDimensions} from '~/theme/dimension';
import {fontFamilies} from '~/theme/fonts';
import {ITheme} from '~/theme/interfaces';
import notificationsActions from '~/screens/Notification/redux/actions';
import chatActions from '~/screens/Chat/redux/actions';

import {createSideTabNavigator} from '../../../components/SideTabNavigator';
import {screens} from './screens';

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
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  const Tab = isPhone ? BottomTab : SideTab;

  const styles = createStyles(theme, isPhone, isLaptop);
  const tabBadge = useTabBadge();

  const dispatch = useDispatch();

  const {streamClient, streamNotiSubClient} = useContext(AppContext);

  const userId = useUserIdAuth();
  useEffect(() => {
    dispatch(chatActions.initChat());
    if (streamClient?.currentUser?.token) {
      dispatch(
        notificationsActions.getNotifications({
          streamClient,
          userId: userId.toString(),
        }),
      );

      streamNotiSubClient &&
        subscribeGetstreamFeed(
          streamNotiSubClient,
          'notification',
          'u-' + userId,
          realtimeCallback,
        );
    }
  }, []);

  // callback function when client receive realtime activity in notification feed
  // load notifications again to get new unseen number (maybe increase maybe not if new activity is grouped)
  // with this, we also not to load notification again when access Notification screen
  const realtimeCallback = () => {
    streamClient &&
      dispatch(
        notificationsActions.getNotifications({
          streamClient,
          userId: userId.toString(),
        }),
      );
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
              tabBarIcon: ({
                focused,
                color,
              }: {
                focused: boolean;
                color: string;
              }) => {
                if (isLaptop) return null;

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
              // @ts-ignore
              tabBarBadge: tabBadge[name] > 99 ? '99+' : tabBadge[name],
              tabBarBadgeStyle: {
                fontFamily: fontFamilies.SegoeSemibold,
                // @ts-ignore
                backgroundColor: tabBadge[name] > 0 ? '#EC2626' : 'transparent',
              },
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
