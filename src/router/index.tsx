import React, {useEffect} from 'react';
import {View, Linking} from 'react-native';

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
import {linkingConfig, navigationSetting} from '~/configs/navigator';
import {rootSwitch} from './stack';
import {rootNavigationRef} from './navigator/refs';
import {isNavigationRefReady} from './helper';
import {RootStackParamList} from '~/interfaces/IRouter';

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = (): React.ReactElement => {
  useEffect(() => {
    //@ts-ignore
    isNavigationRefReady.current = false;

    /*Deep link*/
    Linking.addEventListener('url', handleOpenURL);
    handleDeepLink();
  }, []);

  const theme = useTheme();

  const [initialRouteName, setInitialRouteName] = React.useState<
    string | undefined
  >();

  /*Deep link*/
  /*Handle when app killed*/
  const handleDeepLink = async () => {
    const initialUrl = await Linking.getInitialURL();
    console.log('handleDeepLink', {initialUrl});

    //[TO-DO] replace url with config url
    const path = initialUrl?.replace('http://localhost:8080/', '');
    if (path) {
      const route = path.substr(0, path.indexOf('/'));
      setInitialRouteName(route);
    }
  };

  /*Handle when app in background*/
  const handleOpenURL = (event: any) => {
    console.log('handleOpenURL', {event});
  };

  const cardStyleConfig = navigationSetting.defaultNavigationOption.cardStyle;

  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  if (initialRouteName === undefined) return <View />;

  return (
    <NavigationContainer
      linking={linkingConfig}
      ref={rootNavigationRef}
      onReady={() => {
        //@ts-ignore
        isNavigationRefReady.current = true;
      }}
      theme={navigationTheme}>
      <Stack.Navigator screenOptions={{cardStyle: cardStyleConfig}}>
        <Stack.Screen
          options={{headerShown: false}}
          //@ts-ignore
          name={rootSwitch.appLoading}
          component={screens.AppLoading}
        />
        <Stack.Screen
          options={{headerShown: false}}
          //@ts-ignore
          name={rootSwitch.authStack}
          component={screens.AuthStack}
        />
        <Stack.Screen
          options={{headerShown: false}}
          //@ts-ignore
          name={rootSwitch.mainStack}
          component={screens.MainStack}
          initialParams={{initialRouteName}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
