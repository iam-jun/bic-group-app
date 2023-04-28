import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
  Linking, StatusBar, StyleSheet, View,
} from 'react-native';
import { Host } from 'react-native-portalize';

import * as SplashScreen from 'expo-splash-screen';
import AlertModal from '~/beinComponents/modals/AlertModal';
import AlertNewFeatureModal from '~/beinComponents/modals/AlertNewFeatureModal';
import LoadingModal from '~/beinComponents/modals/LoadingModal';
import Toast from '~/baseComponents/Toast';
import { AppConfig } from '~/configs';
import InternetConnectionStatus from '~/components/network/InternetConnectionStatus';
import SystemIssueModal from '~/components/network/SystemIssueModal';
import useNetworkStore from '~/store/network';
import { makeRemovePushTokenRequest } from '~/api/apiRequest';
import { hideSplashScreen, isNavigationRefReady, withNavigation } from './helper';

import { rootNavigationRef } from './refs';
import { rootSwitch } from './stack';
import * as appTheme from '~/theme/theme';
import { registerNavigationContainerWithSentry } from '~/services/sentry';

import AuthStack from '~/router/navigator/AuthStack';
import MainStack from '~/router/navigator/MainStack';
import useNavigationLinkingConfig, { onReceiveURL } from '~/hooks/navigationLinking';
import { useAuthValidateSession, useUserIdAuth } from '~/hooks/auth';
import VideoPlayerWebView from '~/components/VideoPlayerWebView';
import ForceUpdateView from '~/components/ForceUpdateView';
import Maintenance from '~/screens/Maintenance';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const rootNavigation = withNavigation(rootNavigationRef);

const RootNavigator = (): React.ReactElement => {
  const theme = useTheme();

  const networkActions = useNetworkStore((state) => state.actions);

  useAuthValidateSession();

  const userId = useUserIdAuth();

  const linkingConfig = useNavigationLinkingConfig();

  useEffect(() => {
    const getInitialUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        await onReceiveURL({ url, navigation: rootNavigation });
      } else {
        await hideSplashScreen();
      }
    };
    getInitialUrl();
  }, []);

  useEffect(
    () => {
      isNavigationRefReady.current = false;
      networkActions.setIsShowSystemIssue(false);

      const unsubscribeNetInfo = NetInfo.addEventListener(() => {
        useNetworkStore.getState().actions.checkIsInternetReachable();
      });
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
          <Maintenance />
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
