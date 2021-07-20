import React from 'react';
import {useTheme} from 'react-native-paper';

import Icon from '~/beinComponents/Icon';

import {createSideTabNavigator} from '../../../components/SideTabNavigator';
import {ITheme} from '~/theme/interfaces';
import {screens} from './screens';
import {bottomTabIcons} from '~/configs/navigator';

const Tab = createSideTabNavigator();

const MainTabs = () => {
  const theme: ITheme = useTheme();
  const {colors} = theme;

  const backBehavior = 'history';

  // const {activeColor, inactiveColor, tabBarBackground} = colors;

  return (
    // @ts-ignore
    <Tab.Navigator backBehavior={backBehavior}>
      {Object.entries(screens).map(([name, component]) => {
        return (
          // @ts-ignore
          <Tab.Screen
            key={'tabs' + name}
            name={name}
            component={component}
            options={{
              tabBarIcon: ({focused, color}) => {
                return (
                  <Icon
                    //@ts-ignore
                    icon={bottomTabIcons[name]}
                    size={24}
                    tintColor={color}
                    bold={focused}
                  />
                );
              },
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default MainTabs;
