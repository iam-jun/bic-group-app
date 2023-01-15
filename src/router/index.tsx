import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { Host } from 'react-native-portalize';

import { useDispatch } from 'react-redux';
import AlertModal from '~/beinComponents/modals/AlertModal';
import AlertNewFeatureModal from '~/beinComponents/modals/AlertNewFeatureModal';
import LoadingModal from '~/beinComponents/modals/LoadingModal';
import Toast from '~/baseComponents/Toast';
import { AppConfig } from '~/configs';
import InternetConnectionStatus from '~/components/network/InternetConnectionStatus';
import SystemIssueModal from '~/components/network/SystemIssueModal';
import noInternetActions from '~/storeRedux/network/actions';
import { makeRemovePushTokenRequest } from '~/api/apiRequest';
import { isNavigationRefReady } from './helper';

import { rootNavigationRef } from './refs';
import { rootSwitch } from './stack';
import * as appTheme from '~/theme/theme';
import { registerNavigationContainerWithSentry } from '~/services/sentry';

import AuthStack from '~/router/navigator/AuthStack';
import MainStack from '~/router/navigator/MainStack';
import useNavigationLinkingConfig from '~/hooks/navigationLinking';
import { useAuthValidateSession, useUserIdAuth } from '~/hooks/auth';
import VideoPlayerWebView from '~/components/VideoPlayerWebView';
import ForceUpdateView from '~/components/ForceUpdateView';

const Stack = createNativeStackNavigator();

const RootNavigator = (): React.ReactElement => {
  const theme = useTheme();
  const dispatch = useDispatch();

  useAuthValidateSession();

  const userId = useUserIdAuth();

  const linkingConfig = useNavigationLinkingConfig();

  useEffect(
    () => {
      isNavigationRefReady.current = false;
      dispatch(noInternetActions.setSystemIssue(false));

      const unsubscribeNetInfo = NetInfo.addEventListener(() => dispatch(noInternetActions.checkInternetReachable()));
      if (!userId) {
        makeRemovePushTokenRequest();
      }

      return () => {
        unsubscribeNetInfo();
      };
    }, [],
  );

  const navigationTheme = theme.dark ? appTheme.dark : appTheme.light;

  const onReady = () => {
    isNavigationRefReady.current = true;
    // Register the navigation container with the instrumentation for Sentry performance monitoring
    registerNavigationContainerWithSentry(rootNavigationRef);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <NavigationContainer
        linking={linkingConfig}
        ref={rootNavigationRef}
        onReady={onReady}
        theme={navigationTheme as any}
        documentTitle={{ enabled: false }}
      >
        <Host>
          <Stack.Navigator
            initialRouteName={
              (userId ? rootSwitch.mainStack : rootSwitch.authStack) as any
            }
          >
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
          <Toast />
          <InternetConnectionStatus />
          <VideoPlayerWebView />
          <ForceUpdateView />
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
