import React from 'react';
import {useTheme} from 'react-native-paper';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Icon from '~/beinComponents/Icon';

import {createSideTabNavigator} from '../../../components/SideTabNavigator';
import {useWindowDimensions, View, StyleSheet} from 'react-native';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {screens} from './screens';
import {bottomTabIcons, bottomTabIconsFocused} from '~/configs/navigator';
import {Text} from '~/components';

const BottomTab = createBottomTabNavigator();
const SideTab = createSideTabNavigator();

const MainTabs = () => {
  const theme: ITheme = useTheme();
  const {colors} = theme;

  const backBehavior = 'history';

  // const {activeColor, inactiveColor, tabBarBackground} = colors;

  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const isPhone = dimensions.width < deviceDimensions.smallTablet;
  const isBigTablet = dimensions.width >= deviceDimensions.bigTablet;

  const Tab = isPhone ? BottomTab : SideTab;

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
          // backgroundColor: tabBarBackground,
          height: 60,
          paddingBottom: !isPhone ? 0 : insets.bottom,
        },
      }}
      tabBarStyle={
        isPhone
          ? {}
          : {
              width: 64,
              backgroundColor: colors.background,
            }
      }>
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
                const label = name.charAt(0).toUpperCase() + name.slice(1);
                const styles = CreateStyle(theme, focused, isPhone);

                return (
                  <View style={styles.container}>
                    <Icon
                      //@ts-ignore
                      icon={icon[name]}
                      size={24}
                      tintColor={color}
                    />
                    {isPhone && (
                      <Text.BodyS style={styles.label}>{label}</Text.BodyS>
                    )}
                  </View>
                );
              },
              tabBarLabel: () => null,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const CreateStyle = (theme: ITheme, focused: boolean, isPhone: boolean) => {
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
      color: focused ? colors.primary7 : colors.textSecondary,
    },
  });
};

export default MainTabs;
