/* @react-navigation v5 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Auth} from 'aws-amplify';
import React, {useEffect} from 'react';
import {Linking, Platform, StyleSheet, View} from 'react-native';
/*Theme*/
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {put} from 'redux-saga/effects';
import AlertModal from '~/beinComponents/modals/AlertModal';
import NormalToastMessage from '~/beinComponents/ToastMessage/NormalToastMessage';
import SimpleToastMessage from '~/beinComponents/ToastMessage/SimpleToastMessage';
import {AppConfig} from '~/configs';
import {
  linkingConfig,
  linkingConfigFull,
  navigationSetting,
} from '~/configs/navigator';
import {useBaseHook} from '~/hooks';
import {useKeySelector} from '~/hooks/selector';
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
import AlertNewFeatureModal from '~/beinComponents/modals/AlertNewFeatureModal';

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = (): React.ReactElement => {
  const theme = useTheme();
  const {t} = useBaseHook();
  const dispatch = useDispatch();

  const [initialRouteName, setInitialRouteName] = React.useState<
    string | undefined
  >();

  const user: IUserResponse | boolean = Store.getCurrentUser();

  const toastMessage = useKeySelector('modal.toastMessage') || {};

  const checkAuthKickout = async () => {
    try {
      await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
    } catch (e) {
      // user not authenticated, user is false
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

  const renderToastMessage = () => {
    if (!toastMessage?.content) return null;

    return Platform.OS === 'web' ? (
      <NormalToastMessage style={styles.toastStyle} {...toastMessage?.props}>
        {toastMessage?.content}
      </NormalToastMessage>
    ) : (
      <SimpleToastMessage
        style={styles.smallToastStyle}
        {...toastMessage?.props}>
        {toastMessage?.content}
      </SimpleToastMessage>
    );
  };

  return (
    <View style={styles.container}>
      <NavigationContainer
        linking={user ? linkingConfigFull : linkingConfig}
        ref={rootNavigationRef}
        onReady={onReady}
        theme={navigationTheme}
        documentTitle={{
          enabled: false,
        }}>
        <Stack.Navigator
          initialRouteName={user ? rootSwitch.mainStack : rootSwitch.authStack}
          screenOptions={{cardStyle: cardStyleConfig}}>
          <Stack.Screen
            options={AppConfig.defaultScreenOptions}
            //@ts-ignore
            name={rootSwitch.authStack}
            component={screens.AuthStack}
          />
          <Stack.Screen
            options={AppConfig.defaultScreenOptions}
            //@ts-ignore
            name={rootSwitch.mainStack}
            component={screens.MainStack}
            initialParams={{initialRouteName}}
          />
          <Stack.Screen
            options={getOptions(t)}
            // @ts-ignore
            name={rootSwitch.notFound}
            component={screens.NotFound}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <AlertModal />
      <AlertNewFeatureModal />

      {renderToastMessage()}
    </View>
  );
};

const getOptions = (t: any) => {
  if (Platform.OS !== 'web') {
    return undefined;
  }

  return {headerShown: false, title: t('web:title_not_found')};
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toastStyle: {
    position: 'absolute',
    left: 40,
    bottom: 40,
  },
  smallToastStyle: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 110,
  },
});

export default StackNavigator;
