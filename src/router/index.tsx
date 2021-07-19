import React, {useEffect} from 'react';

/*Theme*/
import {useTheme} from 'react-native-paper';
/* @react-navigation v5 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

/*import config navigation*/
import * as screens from './navigator';
import {navigationSetting} from '~/configs/navigator';
import {rootSwitch} from './stack';
import {rootNavigationRef} from './navigator/refs';
import {isNavigationRefReady} from './helper';

const Stack = createStackNavigator();

const StackNavigator = () => {
  useEffect(() => {
    isNavigationRefReady.current = false;
  }, []);

  const theme = useTheme();

  const cardStyleConfig = navigationSetting.defaultNavigationOption.cardStyle;

  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  const config = {
    screens: {
      MainStack: {
        screens: {
          BottomTabs: {
            screens: {
              home: {
                path: 'home',
                screens: {
                  home: {
                    path: '',
                  },
                },
              },
              Chat: {
                path: 'chat',
                screens: {
                  Chat: {
                    path: '',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const linking = {
    prefixes: ['https://bein.group', 'bein://'],
    config,
  };

  return (
    <NavigationContainer
      linking={linking}
      ref={rootNavigationRef}
      onReady={() => {
        isNavigationRefReady.current = true;
      }}
      theme={navigationTheme}>
      <Stack.Navigator screenOptions={{cardStyle: cardStyleConfig}}>
        <Stack.Screen
          options={{headerShown: false}}
          name={rootSwitch.appLoading}
          component={screens.AppLoading}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name={rootSwitch.authStack}
          component={screens.AuthStack}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name={rootSwitch.mainStack}
          component={screens.MainStack}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
