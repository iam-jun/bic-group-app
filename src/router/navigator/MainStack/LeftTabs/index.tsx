import React, {useContext, useEffect} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import RedDot from '~/beinComponents/Badge/RedDot';
import Icon from '~/beinComponents/Icon';
import Image from '~/beinComponents/Image';
import {bottomTabIcons, bottomTabIconsFocused} from '~/configs/navigator';
import {AppContext} from '~/contexts/AppContext';
import {useUserIdAuth} from '~/hooks/auth';
import useTabBadge from '~/hooks/tabBadge';
import images from '~/resources/images';
import {ITheme} from '~/theme/interfaces';
import notificationsActions from '../../../../screens/Notification/redux/actions';
import {createSideTabNavigator} from '../../../components/SideTabNavigator';
import {screens} from './screens';

const Tab = createSideTabNavigator();

interface Props {
  initialRouteName?: string;
}

const LeftTabs: React.FC<Props> = (): React.ReactElement => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = CreateStyle(theme);

  // const {activeColor, inactiveColor, tabBarBackground} = colors;
  const tabBadge = useTabBadge();

  const dispatch = useDispatch();

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
      activeBackgroundColor={colors.bgButtonSecondary}
      backBehavior={'history'}
      tabBarStyle={styles.navigatorContainer}>
      {Object.entries(screens).map(([name, component]) => {
        return (
          // @ts-ignore
          <Tab.Screen
            key={'tabs' + name}
            name={name}
            component={component}
            options={{
              tabBarIcon: ({focused}: {focused: boolean}) => {
                // @ts-ignore
                const unreadCount = tabBadge[name] || undefined;

                return (
                  <View style={styles.iconContainer}>
                    {renderIcon(name, focused)}
                    {!!unreadCount && (
                      <RedDot style={styles.badge} number={unreadCount} />
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

const CreateStyle = (theme: ITheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    navigatorContainer: {
      backgroundColor: colors.background,
      ...Platform.select({
        web: {
          width: 80,
          borderRightColor: colors.borderDivider,
          borderRightWidth: 1,
        },
        default: {
          width: 48,
        },
      }),
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
