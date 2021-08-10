import React, {useEffect} from 'react';
import {View, Linking} from 'react-native';
import messaging from '@react-native-firebase/messaging';
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
  const theme = useTheme();

  const [initialRouteName, setInitialRouteName] = React.useState<
    string | undefined
  >();

  useEffect(() => {
    //@ts-ignore
    isNavigationRefReady.current = false;

    /*Deep link*/
    Linking.addEventListener('url', handleOpenURL);
    handleDeepLink();
  }, []);

  /*Deep link*/
  /*Handle when app killed*/
  const handleDeepLink = async () => {
    const initialUrl = await Linking.getInitialURL();
    console.log('handleDeepLink', {initialUrl});
    // TODO:
    // const navigation = withNavigation(rootNavigationRef);
    // navigation.replace(rootSwitch.mainStack);

    //[TO-DO] replace url with config url
    const path = initialUrl?.replace('http://0.0.0.0:8080/', '') || '';
    const route =
      path.indexOf('/') >= 0 ? path.substr(0, path.indexOf('/')) : path;
    setInitialRouteName(route || '');
  };

  /*Handle when app in background*/
  const handleOpenURL = (event: any) => {
    // TODO:
    // const navigation = withNavigation(rootNavigationRef);
    // navigation.replace(rootSwitch.authStack);
    console.log('handleOpenURL', {event});
  };

  const cardStyleConfig = navigationSetting.defaultNavigationOption.cardStyle;

  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  if (initialRouteName === undefined) return <View />;

  const onReady = () => {
    //@ts-ignore
    isNavigationRefReady.current = true;
  };

  return (
    <NavigationContainer
      linking={{
        ...linkingConfig,
        async getInitialURL() {
          // Check if app was opened from a deep link
          const url = await Linking.getInitialURL();

          if (url != null) {
            return url;
          }

          // Check if there is an initial firebase notification
          const message = await messaging().getInitialNotification();

          // Get deep link from data
          // if this is undefined, the app will open the default/home page
          return message?.data?.link;
        },
      }}
      ref={rootNavigationRef}
      onReady={onReady}
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
