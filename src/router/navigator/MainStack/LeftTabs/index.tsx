import React, {useEffect} from 'react';
import {DeviceEventEmitter, StyleSheet, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import NotificationsBadge from '~/beinComponents/Badge/NotificationsBadge';

import Icon from '~/beinComponents/Icon';
import Image from '~/beinComponents/Image';
import {bottomTabIcons, bottomTabIconsFocused} from '~/configs/navigator';
import useTabBadge from '~/hooks/tabBadge';
import images from '~/resources/images';

import notificationsActions from '../../../../screens/Notification/redux/actions';
import {createSideTabNavigator} from '../../../components/SideTabNavigator';
import {screens} from './screens';

const Tab = createSideTabNavigator();

interface Props {
  initialRouteName?: string;
}

const LeftTabs: React.FC<Props> = (): React.ReactElement => {
  const theme: ExtendedTheme = useTheme();
  const {colors} = theme;
  const styles = CreateStyle(theme);

  // const {activeColor, inactiveColor, tabBarBackground} = colors;
  const tabBadge = useTabBadge();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(notificationsActions.getNotifications());
  }, []);

  const renderIcon = (name: string, focused: boolean) => {
    if (name === 'home') {
      return (
        <Image
          source={
            focused ? images.logo_bein_simple : images.logo_bein_black_white
          }
          resizeMode="contain"
          style={styles.logoBein}
        />
      );
    }

    const icon = focused ? bottomTabIconsFocused : bottomTabIcons;

    return (
      <Icon
        //@ts-ignore
        icon={icon[name]}
        size={24}
        tintColor="none"
        bold={focused}
      />
    );
  };

  return (
    // @ts-ignore
    <Tab.Navigator
      activeBackgroundColor={colors.white}
      backBehavior={'history'}
      tabBarStyle={styles.navigatorContainer}>
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
            options={{
              tabBarIcon: ({focused}: {focused: boolean}) => {
                // @ts-ignore
                const unreadCount = tabBadge[name] || undefined;

                return (
                  <View testID={`tab_${name}`} style={styles.iconContainer}>
                    {renderIcon(name, focused)}
                    {!!unreadCount && (
                      <NotificationsBadge.Alert
                        style={styles.badge}
                        number={unreadCount}
                      />
                    )}
                  </View>
                );
              },
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const CreateStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    navigatorContainer: {
      backgroundColor: colors.white,
      width: 48,
    },
    logoBein: {
      width: 26.67,
      height: 26.67,
    },
    iconContainer: {
      flex: 1,
      height: 64,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    badge: {
      position: 'absolute',
      top: '16%',
      left: '54%',
    },
  });
};

export default LeftTabs;
