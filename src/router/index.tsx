/* @react-navigation v5 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Auth} from 'aws-amplify';
import React, {useEffect} from 'react';
import {Linking} from 'react-native';
/*Theme*/
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {put} from 'redux-saga/effects';
import {linkingConfig, navigationSetting} from '~/configs/navigator';
import {useBaseHook} from '~/hooks';
import {IUserResponse} from '~/interfaces/IAuth';
import {RootStackParamList} from '~/interfaces/IRouter';
import {signOut} from '~/screens/Auth/redux/actions';
import Store from '~/store';
import * as modalActions from '~/store/modal/actions';
import {isNavigationRefReady} from './helper';
/*import config navigation*/
import * as screens from './navigator';
import {rootNavigationRef} from './navigator/refs';
import {rootSwitch} from './stack';

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = (): React.ReactElement => {
  const theme = useTheme();
  const {t} = useBaseHook();
  const dispatch = useDispatch();

  const [initialRouteName, setInitialRouteName] = React.useState<
    string | undefined
  >();

  const user: IUserResponse | boolean = Store.getCurrentUser();

  const checkAuthKickout = async () => {
    try {
      await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
    } catch (e) {
      // user not authenticated
      if (!user) {
        return;
      }
      dispatch(signOut());
      dispatch(
        modalActions.showAlert({
          title: t('auth:text_kickout_title'),
          content: t('auth:text_kickout_desc'),
          onConfirm: () => put(modalActions.hideAlert()),
          confirmLabel: t('auth:text_kickout_confirm_button'),
        }),
      );
    }
  };

  useEffect(() => {
    //@ts-ignore
    isNavigationRefReady.current = false;
    checkAuthKickout();
    handleDeepLink();
    /*Deep link*/
    Linking.addEventListener('url', handleOpenURL);
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
  };

  const cardStyleConfig = navigationSetting.defaultNavigationOption.cardStyle;

  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  const onReady = () => {
    //@ts-ignore
    isNavigationRefReady.current = true;
  };

  return (
    <NavigationContainer
      linking={linkingConfig}
      ref={rootNavigationRef}
      onReady={onReady}
      theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName={user ? rootSwitch.mainStack : rootSwitch.authStack}
        screenOptions={{cardStyle: cardStyleConfig}}>
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
