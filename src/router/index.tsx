/* @react-navigation v5 */
import NetInfo from '@react-native-community/netinfo';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Auth} from 'aws-amplify';
import React, {useEffect} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
/*Theme*/
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {put} from 'redux-saga/effects';
import AlertModal from '~/beinComponents/modals/AlertModal';
import AlertNewFeatureModal from '~/beinComponents/modals/AlertNewFeatureModal';
import LoadingModal from '~/beinComponents/modals/LoadingModal';
import ToastMessage from '~/beinComponents/ToastMessage/ToastMessage';
import {AppConfig} from '~/configs';
import {
  linkingConfig,
  linkingConfigFull,
  navigationSetting,
} from '~/configs/navigator';
import {useBaseHook} from '~/hooks';
import {useRootNavigation} from '~/hooks/navigation';
import {IUserResponse} from '~/interfaces/IAuth';
import {RootStackParamList} from '~/interfaces/IRouter';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import authActions from '~/screens/Auth/redux/actions';
import InternetConnectionStatus from '~/screens/NoInternet/components/InternetConnectionStatus';
import SystemIssueModal from '~/screens/NoInternet/components/SystemIssueModal';
import noInternetActions from '~/screens/NoInternet/redux/actions';
import {makeRemovePushTokenRequest} from '~/services/httpApiRequest';
import Store from '~/store';
import * as modalActions from '~/store/modal/actions';
import {isNavigationRefReady} from './helper';
/*import config navigation*/
import * as screens from './navigator';
import {rootNavigationRef} from './navigator/refs';
import {rootSwitch} from './stack';
import * as appTheme from '~/theme/theme';

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = (): React.ReactElement => {
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme();
  const {t} = useBaseHook();
  const dispatch = useDispatch();

  const user: IUserResponse | boolean = Store.getCurrentUser();

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(() =>
      dispatch(noInternetActions.checkInternetReachable()),
    );

    return () => {
      unsubscribeNetInfo();
    };
  }, []);

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
      dispatch(authActions.signOut());
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
    // Linking.addEventListener('url', handleOpenURL);
    dispatch(noInternetActions.setSystemIssue(false));

    if (!user) {
      makeRemovePushTokenRequest();
    }
  }, []);

  /*Handle when app killed*/
  const handleDeepLink = async () => {
    // wait for implementation
  };

  const cardStyleConfig = navigationSetting.defaultNavigationOption.cardStyle;

  const navigationTheme = theme.dark ? appTheme.dark : appTheme.light;

  const onReady = () => {
    //@ts-ignore
    isNavigationRefReady.current = true;
  };

  const linking = getLinkingCustomConfig(
    user ? linkingConfigFull : linkingConfig,
    rootNavigation,
  );

  return (
    <View style={styles.container}>
      <NavigationContainer
        linking={linking}
        ref={rootNavigationRef}
        onReady={onReady}
        theme={navigationTheme}
        documentTitle={{
          enabled: false,
        }}>
        <Stack.Navigator
          //@ts-ignore
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
          />
          <Stack.Screen
            // @ts-ignore
            name={rootSwitch.notFound}
            component={screens.NotFound}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <AlertModal />
      <AlertNewFeatureModal />
      <SystemIssueModal />
      <LoadingModal />
      <ToastMessage />
      <InternetConnectionStatus />
    </View>
  );
};

const getLinkingCustomConfig = (config: any, navigation: any) => {
  return {
    ...config,
    subscribe(listener: any) {
      const onReceiveURL = ({url}: {url: string}) => {
        if (url.includes('bein:///posts/')) {
          const data = url?.replace('bein:///posts/', '');
          const params = data.split('?');

          if (params?.length === 1) {
            navigation?.navigate?.(homeStack.postDetail, {post_id: data});
          } else if (params?.length > 1 && navigation) {
            const newParams = params[1]
              .split('&')
              ?.map(item => item.split('='))
              ?.reduce((p, c) => {
                if (c.length > 1) {
                  //@ts-ignore
                  p[c[0]] = c[1];
                }
                return p;
              }, {});

            navigation?.navigate?.(homeStack.commentDetail, {
              ...newParams,
              postId: params[0],
            });
          } else {
            listener(url);
          }
        } else {
          listener(url);
        }
      };
      Linking.addEventListener('url', onReceiveURL);

      return () => {
        Linking.removeEventListener('url', onReceiveURL);
      };
    },
  };
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    width: '100%',
    height: '100%',
  },
});

export default StackNavigator;
