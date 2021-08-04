import React from 'react';
import {useTheme} from 'react-native-paper';

import Icon from '~/beinComponents/Icon';

import {createSideTabNavigator} from '../../../components/SideTabNavigator';
import {View, StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {screens} from './screens';
import {bottomTabIcons, bottomTabIconsFocused} from '~/configs/navigator';

const Tab = createSideTabNavigator();

interface Props {
  initialRouteName?: string;
}

const LeftTabs: React.FC<Props> = ({initialRouteName}): React.ReactElement => {
  const theme: ITheme = useTheme();
  const {colors} = theme;
  const styles = CreateStyle();

  // const {activeColor, inactiveColor, tabBarBackground} = colors;

  return (
    // @ts-ignore
    <Tab.Navigator
      initialRouteName={initialRouteName}
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
              tabBarIcon: ({focused, color}) => {
                const icon = focused ? bottomTabIconsFocused : bottomTabIcons;
                return (
                  <View style={styles.iconContainer}>
                    <Icon
                      //@ts-ignore
                      icon={icon[name]}
                      size={24}
                      tintColor="none"
                      bold={focused}
                    />
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

const CreateStyle = () => {
  return StyleSheet.create({
    navigatorContainer: {
      width: 48,
    },
    iconContainer: {
      flex: 1,
      height: 64,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default LeftTabs;
