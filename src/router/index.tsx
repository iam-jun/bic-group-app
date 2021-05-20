import React from 'react';
import {useTranslation} from 'react-i18next';

/*Theme*/
import {useTheme} from 'react-native-paper';
import {DefaultTheme, DarkTheme} from '@react-navigation/native';

/* @react-navigation v5 */
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

/*import config navigation*/
import * as screens from './navigator';
import {navigationSetting} from '~/configs/navigator';

import {IStack} from '~/interfaces/navigator';
import {IObject} from '~/interfaces/common';

import {navigationRef} from '~/utils/refNavigator';

const Stack = createStackNavigator();

const StackNavigator = () => {
  const theme = useTheme();
  const {i18n} = useTranslation();

  const lang: string = i18n.language;

  const initialRoute: string = navigationSetting.configs.initialRouteName;
  const cardStyleConfig = navigationSetting.defaultNavigationOption.cardStyle;

  /* StackNavigator  */
  const StackNavigators = navigationSetting.stacks;

  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  // const containerRef = React.useRef(null);

  const ref: any = navigationRef;

  const listScreens: IObject<any> = screens;

  return (
    <NavigationContainer ref={ref} theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{cardStyle: cardStyleConfig}}>
        {StackNavigators.map((stack: IStack) => {
          if (!Object.keys(screens).includes(stack.screen)) {
            return null;
          }
          return (
            <Stack.Screen
              key={'screen' + stack.screen}
              name={stack.router}
              component={listScreens[stack.screen]}
              options={{
                title: lang === 'en' ? stack.title.en : stack.title.vi,
                headerShown:
                  stack.options && stack.options.headerShown
                    ? stack.options.headerShown
                    : false,
                animationEnabled:
                  stack.options && !stack.options.animationEnabled
                    ? stack.options.animationEnabled
                    : true,
              }}
            />
          );
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
