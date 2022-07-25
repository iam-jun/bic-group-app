import React from 'react';
import { DeviceEventEmitter, StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme, useNavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { useBackHandler } from '@react-native-community/hooks';
import { useDispatch } from 'react-redux';

import CommonModal from '~/beinFragments/CommonModal';
import UserProfilePreviewBottomSheet from '~/beinFragments/Preview/UserProfilePreviewBottomSheet';
import ReactionBottomSheet from '~/beinFragments/reaction/ReactionBottomSheet';
import ReactionDetailBottomSheet from '~/beinFragments/reaction/ReactionDetailBottomSheet';
import {
  customBackHandlerRoutes,
  NAVIGATION_BACK_PRESSED,
} from '~/configs/navigator';
import { useKeySelector } from '~/hooks/selector';
import MenuSidebarDrawer from '~/router/components/MenuSidebarDrawer';
import { getActiveRouteState } from '~/router/helper';
import PostAudiencesBottomSheet from '~/screens/Post/components/PostAudiencesBottomSheet';
import appActions from '~/store/app/actions';

import mainTabScreens from './screens';
import mainTabStack from './stack';
import MainTabs from '~/router/navigator/MainStack/MainTabs';
import { AppConfig } from '~/configs';

const Stack = createNativeStackNavigator();

const MainStack = (): React.ReactElement => {
  const dispatch = useDispatch();

  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const navState = useNavigationState((state: any) => state);
  const drawerVisible = useKeySelector('app.drawerVisible');

  useBackHandler(() => {
    const activeRoute = getActiveRouteState(navState);

    if (drawerVisible) {
      dispatch(appActions.setDrawerVisible(false));
      return true;
    }
    if (activeRoute && customBackHandlerRoutes.includes(activeRoute)) {
      DeviceEventEmitter.emit(NAVIGATION_BACK_PRESSED);
      return true;
    }
    return false;
  });

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
      <MenuSidebarDrawer />
      <PostAudiencesBottomSheet />
      <ReactionBottomSheet />
      <ReactionDetailBottomSheet />
      <UserProfilePreviewBottomSheet />
      <CommonModal />
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
