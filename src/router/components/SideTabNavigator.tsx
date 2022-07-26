import * as React from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  NavigationHelpersContext,
  ParamListBase,
  TabActionHelpers,
  TabActions,
  TabNavigationState,
  TabRouter,
  TabRouterOptions,
  useNavigationBuilder,
} from '@react-navigation/native';

type TabNavigationConfig = {
  containerStyle?: StyleProp<ViewStyle>;
  tabBarStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  activeTintColor?: string;
  inactiveTintColor?: string;
  activeBackgroundColor?: string;
};

type TabNavigationOptions = {
  title?: string;
  tabBarIcon: (props: {focused: boolean; color?: string}) => React.ReactNode;
};

type TabNavigationEventMap = {
  tabPress: {
    data: {isAlreadyFocused: boolean};
    canPreventDefault: true;
  };
};

type Props = DefaultNavigatorOptions<TabNavigationOptions> &
  TabRouterOptions &
  TabNavigationConfig;

function SideTabNavigator({
  initialRouteName,
  children,
  screenOptions,
  tabBarStyle,
  contentStyle,
  activeTintColor,
  inactiveTintColor,
  activeBackgroundColor,
}: Props) {
  const { state, navigation, descriptors } = useNavigationBuilder<
    TabNavigationState<ParamListBase>,
    TabRouterOptions,
    TabActionHelpers<ParamListBase>,
    TabNavigationOptions,
    TabNavigationEventMap
  >(TabRouter, {
    children,
    screenOptions,
    initialRouteName,
  });

  return (
    <NavigationHelpersContext.Provider value={navigation}>
      <View style={styles.container}>
        <View style={[styles.tabBar, tabBarStyle]}>
          {state.routes.map((route) => {
            const focused = route.key === state.routes[state.index].key;
            return (
              <Pressable
                key={route.key}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                    data: {
                      isAlreadyFocused: focused,
                    },
                  });

                  if (!event.defaultPrevented) {
                    navigation.dispatch({
                      ...TabActions.jumpTo(route.name),
                      target: state.key,
                    });
                  }
                }}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    focused ? { backgroundColor: activeBackgroundColor } : {},
                  ]}
                >
                  {descriptors[route.key].options.title && (
                    <Text>{descriptors[route.key].options.title}</Text>
                  )}
                  {descriptors[route.key].options.tabBarIcon
                    && descriptors[route.key].options.tabBarIcon({
                      focused,
                      color: focused ? activeTintColor : inactiveTintColor,
                    })}
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={[styles.content, contentStyle]}>
          {state.routes.map((route, i) => (
            <View
              key={route.key}
              style={[
                StyleSheet.absoluteFill,
                { display: i === state.index ? 'flex' : 'none' },
              ]}
            >
              {descriptors[route.key].render()}
            </View>
          ))}
        </View>
      </View>
    </NavigationHelpersContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  tabBar: {
    flexDirection: 'column',
  },
  iconWrapper: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
});

export default createNavigatorFactory<
  TabNavigationState<ParamListBase>,
  TabNavigationOptions,
  TabNavigationEventMap,
  typeof SideTabNavigator
>(SideTabNavigator);

export const createSideTabNavigator = createNavigatorFactory(SideTabNavigator);
