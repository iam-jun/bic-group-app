import React, { useEffect } from 'react';
import { DeviceEventEmitter, StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme, useNavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useBackHandler } from '@react-native-community/hooks';
import { useDispatch } from 'react-redux';

import CommonModal from '~/components/CommonModal';
import ReactionBottomSheet from '~/components/reaction/ReactionBottomSheet';
import ReactionDetailBottomSheet from '~/components/reaction/ReactionDetailBottomSheet';
import {
  customBackHandlerRoutes,
  EVENT_NAVIGATION_BACK_PRESSED,
} from '~/router/config';
import { useKeySelector } from '~/hooks/selector';
import { getActiveRouteState } from '~/router/helper';
import appActions from '~/storeRedux/app/actions';

import mainTabScreens from './screens';
import mainTabStack from './stack';
import MainTabs from '~/router/navigator/MainStack/MainTabs';
import { AppConfig } from '~/configs';
import BottomList from '~/components/BottomList';
import LoggerView from '~/components/LoggerView';
import useUserProfileStore from '~/screens/Menu/UserProfile/store';

const Stack = createNativeStackNavigator();

const MainStack = (): React.ReactElement => {
  const dispatch = useDispatch();
  const actions = useUserProfileStore((state) => state.actions);

  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const navState = useNavigationState((state: any) => state);
  const drawerVisible = useKeySelector('app.drawerVisible');
  const debuggerVisible = useKeySelector('app.debuggerVisible');

  useBackHandler(() => {
    const activeRoute = getActiveRouteState(navState);

    if (drawerVisible) {
      dispatch(appActions.setDrawerVisible(false));
      return true;
    }
    if (activeRoute && customBackHandlerRoutes.includes(activeRoute)) {
      DeviceEventEmitter.emit(EVENT_NAVIGATION_BACK_PRESSED);
      return true;
    }
    return false;
  });

  useEffect(() => {
    actions.getLanguages();
    actions.getCountry();
    actions.getCity();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack.Navigator screenOptions={AppConfig.defaultScreenOptions}>
          <Stack.Screen name="main" component={MainTabs} />
          {Object.entries(mainTabStack).map(([name, component]) => (
            <Stack.Screen
              key={`screen${component}`}
              name={component}
              component={mainTabScreens[component]}
              options={{
                headerShown: false,
                title: name,
              }}
            />
          ))}
        </Stack.Navigator>
      </View>
      <ReactionBottomSheet />
      <ReactionDetailBottomSheet />
      <CommonModal />
      <BottomList />
      {debuggerVisible && <LoggerView /> }
      {/* <LoggerView /> */}
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      alignItems: 'center',
    },
    content: {
      width: '100%',
      height: '100%',
    },
  });
};

export default MainStack;
