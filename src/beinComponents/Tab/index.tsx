import React from 'react';
import {useTheme} from 'react-native-paper';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
import {IMenuItemProps} from '~/interfaces/IMenu';

interface TabMenuProps {
  data: IMenuItemProps[];
  menuActiveTintColor?: string;
  menuInactiveTintColor?: string;
  indicatorActiveColor?: string;
}

const Tab = createMaterialTopTabNavigator();

const TabMenu = ({
  data,
  menuActiveTintColor,
  menuInactiveTintColor,
  indicatorActiveColor,
}: TabMenuProps) => {
  const theme: ITheme = useTheme();

  return (
    <Tab.Navigator
      tabBarOptions={{
        showIcon: true,
        showLabel: false,
        activeTintColor: menuActiveTintColor || theme.colors.primary7,
        inactiveTintColor: menuInactiveTintColor || theme.colors.textPrimary,
        indicatorStyle: {
          backgroundColor: indicatorActiveColor || theme.colors.primary7,
        },
      }}>
      {data.map((item: IMenuItemProps, index: number) => {
        return (
          <Tab.Screen
            key={`tab ${index}`}
            name={item.routeName}
            component={item.component}
            options={{
              tabBarIcon: ({color}: {color: string}) => (
                <Icon
                  label={item.label}
                  labelStyle={{width: '100%', color}}
                  icon={item.iconName}
                  size={16}
                />
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default TabMenu;
