import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StackNavigationProp} from '@react-navigation/stack';

import Home from '~/screens/Home';
import Notification from '~/screens/Notification';
import Search from '~/screens/Search';
import Vip from '~/screens/Vip';
import Groups from '~/screens/Groups';
import {bottomTabs} from '~/configs/navigator/index';
import {spacing} from '~/theme/configs';
import Icon from '~/theme/components/Icon';

const Tab = createBottomTabNavigator();

type Props = {
  navigation: StackNavigationProp<any, any>;
};
/**
 * @TabNavigator
 */
export default (props: Props) => {
  const {navigation} = props;
  return (
    <Tab.Navigator
      backBehavior="initialRoute"
      tabBarOptions={{
        tabStyle: {
          paddingVertical: spacing.margin.small,
        },
        labelPosition: 'below-icon',
      }}>
      <Tab.Screen
        name={bottomTabs.home}
        component={Home}
        options={{
          tabBarIcon: ({color, focused}) => (
            <Icon
              onPress={() => navigation.navigate(bottomTabs.home)}
              icon="iconHome"
              size={24}
              tintColor={color}
              bold={focused}
            />
          ),
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate(route.name);
          },
        })}
      />
      <Tab.Screen
        name={bottomTabs.vip}
        component={Vip}
        options={{
          tabBarIcon: ({color, focused}) => (
            <Icon
              onPress={() => navigation.navigate(bottomTabs.vip)}
              icon="iconDiamond"
              size={24}
              tintColor={color}
              bold={focused}
            />
          ),
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate(route.name);
          },
        })}
      />
      <Tab.Screen
        name={bottomTabs.groups}
        component={Groups}
        options={{
          tabBarIcon: ({color, focused}) => (
            <Icon
              onPress={() => navigation.navigate(bottomTabs.groups)}
              icon="iconGroup"
              size={24}
              tintColor={color}
              bold={focused}
            />
          ),
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate(route.name);
          },
        })}
      />
      <Tab.Screen
        name={bottomTabs.notification}
        component={Notification}
        options={{
          tabBarIcon: ({color, focused}) => (
            <Icon
              onPress={() => navigation.navigate(bottomTabs.notification)}
              icon="iconNotification"
              size={24}
              tintColor={color}
              bold={focused}
            />
          ),
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate(route.name);
          },
        })}
      />
      <Tab.Screen
        name={bottomTabs.search}
        component={Search}
        options={{
          tabBarIcon: ({color, focused}) => (
            <Icon
              onPress={() => navigation.navigate(bottomTabs.search)}
              icon="iconSearchMT"
              size={24}
              tintColor={color}
              bold={focused}
            />
          ),
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate(route.name);
          },
        })}
      />
    </Tab.Navigator>
  );
};
