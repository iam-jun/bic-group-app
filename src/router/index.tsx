import NetInfo from '@react-native-community/netinfo';
import {NavigationContainer, useTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {Auth} from 'aws-amplify';
import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {Host} from 'react-native-portalize';

import {useDispatch} from 'react-redux';
import {put} from 'redux-saga/effects';
import AlertModal from '~/beinComponents/modals/AlertModal';
import AlertNewFeatureModal from '~/beinComponents/modals/AlertNewFeatureModal';
import LoadingModal from '~/beinComponents/modals/LoadingModal';
import ToastMessage from '~/beinComponents/ToastMessage/ToastMessage';
import {AppConfig} from '~/configs';
import {useBaseHook} from '~/hooks';
import {IUserResponse} from '~/interfaces/IAuth';
import authActions from '~/screens/Auth/redux/actions';
import InternetConnectionStatus from '~/screens/NoInternet/components/InternetConnectionStatus';
import SystemIssueModal from '~/screens/NoInternet/components/SystemIssueModal';
import noInternetActions from '~/screens/NoInternet/redux/actions';
import {makeRemovePushTokenRequest} from '~/services/httpApiRequest';
import Store from '~/store';
import * as modalActions from '~/store/modal/actions';
import {isNavigationRefReady} from './helper';

import {rootNavigationRef} from './refs';
import {rootSwitch} from './stack';
import * as appTheme from '~/theme/theme';
import {registerNavigationContainerWithSentry} from '~/services/sentry';

import AuthStack from '~/router/navigator/AuthStack';
import MainStack from '~/router/navigator/MainStack';
import useNavigationLinkingConfig from '~/hooks/navigationLinking';

const Stack = createNativeStackNavigator();

const RootNavigator = (): React.ReactElement => {
  const theme = useTheme();
  const {t} = useBaseHook();
  const dispatch = useDispatch();

  const user: IUserResponse | boolean = Store.getCurrentUser();

  const linkingConfig = useNavigationLinkingConfig();

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
    dispatch(noInternetActions.setSystemIssue(false));

    if (!user) {
      makeRemovePushTokenRequest();
    }
  }, []);

  const navigationTheme = theme.dark ? appTheme.dark : appTheme.light;

  const onReady = () => {
    //@ts-ignore
    isNavigationRefReady.current = true;

    // Register the navigation container with the instrumentation for Sentry performance monitoring
    registerNavigationContainerWithSentry(rootNavigationRef);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        translucent
        backgroundColor={'transparent'}
      />
      <NavigationContainer
        linking={linkingConfig}
        ref={rootNavigationRef}
        onReady={onReady}
        theme={navigationTheme as any}
        documentTitle={{enabled: false}}>
        <Host>
          <Stack.Navigator
            initialRouteName={
              (user ? rootSwitch.mainStack : rootSwitch.authStack) as any
            }>
            <Stack.Screen
              options={AppConfig.defaultScreenOptions}
              name={rootSwitch.authStack as any}
              component={AuthStack}
            />
            <Stack.Screen
              options={AppConfig.defaultScreenOptions}
              name={rootSwitch.mainStack as any}
              component={MainStack}
            />
          </Stack.Navigator>
          <AlertNewFeatureModal />
          <AlertModal />
          <SystemIssueModal />
          <LoadingModal />
          <ToastMessage />
          <InternetConnectionStatus />
        </Host>
      </NavigationContainer>
    </View>
  );
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

export default RootNavigator;
