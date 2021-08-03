import React from 'react';
import {useTheme} from 'react-native-paper';

import Icon from '~/beinComponents/Icon';

import {createSideTabNavigator} from '../../../components/SideTabNavigator';
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

  // const {activeColor, inactiveColor, tabBarBackground} = colors;

  return (
    // @ts-ignore
    <Tab.Navigator initialRouteName={initialRouteName} backBehavior={'history'}>
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
                  <Icon
                    //@ts-ignore
                    icon={icon[name]}
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

export default LeftTabs;
