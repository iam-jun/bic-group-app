import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import { useKeySelector } from '~/hooks/selector';
import MenuSidebarContent from '~/router/components/MenuSidebarDrawer/MenuSidebarContent';
import appActions from '~/store/app/actions';

const DeviceWidth = Dimensions.get('window').width;

const MenuSidebarDrawer = () => {
  const [isShow, setIsShow] = useState(false);
  const dispatch = useDispatch();
  const showValue = useSharedValue(0);
  const xValue = useSharedValue(0);

  const insets = useSafeAreaInsets();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(
    theme, insets,
  );

  const drawerVisible = useKeySelector('app.drawerVisible');

  const containerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    backgroundColor: `rgba(13,12,14,${interpolate(
      showValue.value,
      [0, 1],
      [0, 0.64],
    )})`,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    left: interpolate(
      showValue.value, [0, 1], [DeviceWidth, 0],
    ),
  }));

  const hide = (duration = 300) => {
    const onHideDone = () => {
      setIsShow(false);
      dispatch(appActions.setDrawerVisible(false));
    };
    showValue.value = withTiming(
      0, { duration }, () => {
        runOnJS(onHideDone)();
      },
    );
  };

  const show = (duration = 400) => {
    setIsShow(true);
    dispatch(appActions.setDrawerVisible(true));
    showValue.value = withTiming(
      1, { duration },
    );
  };

  useEffect(
    () => {
      if (drawerVisible) {
        show();
      } else {
        hide();
      }
    }, [drawerVisible],
  );

  const gestureHandler = useAnimatedGestureHandler({
    onStart(event: any) {
      xValue.value = withTiming(
        event?.x, { duration: 16 },
      );
    },
    onActive(event: any) {
      const absoluteX = event?.absoluteX || 0;
      const delta = absoluteX - xValue.value;
      const newShowValue = Math.min(
        1, 1 - delta / DeviceWidth,
      );
      showValue.value = withTiming(
        newShowValue, { duration: 0 },
      );
    },
    onFinish(event: any) {
      const absoluteX = event?.absoluteX || 0;
      const delta = absoluteX - xValue.value;
      const newShowValue = Math.min(
        1, 1 - delta / DeviceWidth,
      );
      if (newShowValue < 0.8) {
        runOnJS(hide)();
      } else {
        runOnJS(show)(50);
      }
    },
  });

  if (!isShow) {
    return null;
  }

  return (
    <Animated.View style={containerStyle}>
      <Animated.View style={styles.status} />
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1 }}
        onPress={() => hide()}
      >
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={animatedContentStyle}>
            <TouchableOpacity
              style={styles.contentContainer}
              activeOpacity={1}
              onPress={undefined}
            >
              <MenuSidebarContent onCloseSidebar={hide} />
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      </TouchableOpacity>
    </Animated.View>
  );
};

const themeStyles = (
  theme: ExtendedTheme, insets: any,
) => {
  const { colors } = theme;

  return StyleSheet.create({
    status: {
      height: insets.top,
      backgroundColor: colors.white,
    },
    contentContainer: {
      width: '86%',
      height: '100%',
      alignSelf: 'flex-end',
      backgroundColor: colors.white,
    },
  });
};

export default MenuSidebarDrawer;
