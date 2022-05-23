import {useBackHandler} from '@react-native-community/hooks';
import {
  NavigationContainer,
  useNavigationState,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {
  DeviceEventEmitter,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import CommonModal from '~/beinFragments/CommonModal';
import UserProfilePreviewBottomSheet from '~/beinFragments/Preview/UserProfilePreviewBottomSheet';
import ReactionBottomSheet from '~/beinFragments/reaction/ReactionBottomSheet';
import ReactionDetailBottomSheet from '~/beinFragments/reaction/ReactionDetailBottomSheet';
import {AppConfig} from '~/configs';
import {
  customBackHandlerRoutes,
  NAVIGATION_BACK_PRESSED,
} from '~/configs/navigator';
import BaseStackNavigator from '~/router/components/BaseStackNavigator';
import MenuSidebarDrawer from '~/router/components/MenuSidebarDrawer';
import {getActiveRouteState} from '~/router/helper';
import PostAudiencesBottomSheet from '~/screens/Post/components/PostAudiencesBottomSheet';
import RightCol from '~/screens/RightCol';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {leftNavigationRef, rightNavigationRef} from '../refs';
import LeftTabs from './LeftTabs';
import screens from './screens';
import stack from './stack';
import appActions from '~/store/app/actions';
import {useDispatch} from 'react-redux';
import {useKeySelector} from '~/hooks/selector';

const Stack = createStackNavigator();

const MainStack = (): React.ReactElement => {
  const dimensions = useWindowDimensions();
  const dispatch = useDispatch();

  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const showLeftCol = dimensions.width >= deviceDimensions.laptop;
  const showRightCol = dimensions.width >= deviceDimensions.desktop;

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

  const renderLeftCol = () => (
    <View style={styles.leftCol}>
      <NavigationContainer
        independent
        ref={leftNavigationRef}
        documentTitle={{enabled: false}}>
        <LeftTabs />
      </NavigationContainer>
    </View>
  );

  const renderRightCol = () => (
    <View style={styles.rightCol}>
      <NavigationContainer
        independent
        ref={rightNavigationRef}
        documentTitle={{enabled: false}}>
        <Stack.Navigator>
          <Stack.Screen
            name="right-column"
            component={RightCol}
            options={AppConfig.defaultScreenOptions}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showLeftCol && renderLeftCol()}
        <View style={styles.centerAndRightCol}>
          <View style={styles.centerCol}>
            <BaseStackNavigator stack={stack} screens={screens} />
          </View>
          {showRightCol && renderRightCol()}
        </View>
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

const createStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        Platform.OS === 'web' ? colors.surface : colors.background,
      alignItems: 'center',
    },
    content: {
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      flexGrow: deviceDimensions.totalCols,
      maxWidth: deviceDimensions.desktopBigger,
      alignSelf: 'center',
    },
    leftCol: {
      flex: deviceDimensions.leftCol,
      ...Platform.select({
        web: {
          width: '30%',
          minWidth: 400,
          borderLeftColor: theme.colors.borderDivider,
          borderLeftWidth: 1,
          borderRightColor: theme.colors.borderDivider,
          borderRightWidth: 1,
        },
      }),
    },
    centerAndRightCol: {
      flex: deviceDimensions.centerAndRightCol,
      flexDirection: 'row',
    },
    centerCol: {
      flex: 1,
    },
    rightCol: {
      width: 332,
    },
  });
};

export default MainStack;
