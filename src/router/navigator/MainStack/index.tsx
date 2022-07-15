import {useBackHandler} from '@react-native-community/hooks';
import {useNavigationState} from '@react-navigation/native';
import React from 'react';
import {DeviceEventEmitter, StyleSheet, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import CommonModal from '~/beinFragments/CommonModal';
import UserProfilePreviewBottomSheet from '~/beinFragments/Preview/UserProfilePreviewBottomSheet';
import ReactionBottomSheet from '~/beinFragments/reaction/ReactionBottomSheet';
import ReactionDetailBottomSheet from '~/beinFragments/reaction/ReactionDetailBottomSheet';
import {
  customBackHandlerRoutes,
  NAVIGATION_BACK_PRESSED,
} from '~/configs/navigator';
import {useKeySelector} from '~/hooks/selector';
import BaseStackNavigator from '~/router/components/BaseStackNavigator';
import MenuSidebarDrawer from '~/router/components/MenuSidebarDrawer';
import {getActiveRouteState} from '~/router/helper';
import PostAudiencesBottomSheet from '~/screens/Post/components/PostAudiencesBottomSheet';
import appActions from '~/store/app/actions';

import screens from './screens';
import stack from './stack';

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
        <BaseStackNavigator stack={stack} screens={screens} />
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
  const {colors} = theme;
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
