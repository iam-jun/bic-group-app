import React, {useEffect, useState} from 'react';
import {
  Platform,
  DeviceEventEmitter,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import {useTheme} from 'react-native-paper';
import {useBackHandler} from '@react-native-community/hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const DeviceWidth = Dimensions.get('window').width;

import MenuSidebarContent from '~/router/components/MenuSidebarDrawer/MenuSidebarContent';
import {ITheme} from '~/theme/interfaces';

const MenuSidebarDrawer = () => {
  const [isShow, setIsShow] = useState(false);
  const showValue = useSharedValue(0);

  const insets = useSafeAreaInsets();
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme, insets);

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
    left: interpolate(showValue.value, [0, 1], [DeviceWidth, 0]),
  }));

  const hide = () => {
    const onHideDone = () => {
      setIsShow(false);
    };
    showValue.value = withTiming(0, undefined, () => {
      runOnJS(onHideDone)();
    });
  };

  const show = () => {
    setIsShow(true);
    showValue.value = withTiming(1);
  };

  useBackHandler(() => {
    if (isShow) {
      hide();
    }
    return true;
  });

  useEffect(() => {
    const showMenuSidebarDrawerListener = DeviceEventEmitter.addListener(
      'showMenuSidebarDrawer',
      isShow => {
        if (isShow) {
          show();
        } else {
          hide();
        }
      },
    );
    return () => {
      showMenuSidebarDrawerListener?.remove?.();
    };
  }, []);

  if (Platform.OS === 'web' || !isShow) {
    return null;
  }
  return (
    <Animated.View style={containerStyle}>
      <Animated.View style={styles.status} />
      <TouchableOpacity activeOpacity={1} style={{flex: 1}} onPress={hide}>
        <Animated.View style={animatedContentStyle}>
          <TouchableOpacity
            style={styles.contentContainer}
            activeOpacity={1}
            onPress={undefined}>
            <MenuSidebarContent onCloseSidebar={hide} />
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const themeStyles = (theme: ITheme, insets: any) => {
  const {colors} = theme;

  return StyleSheet.create({
    status: {
      height: insets.top,
      backgroundColor: colors.background,
    },
    contentContainer: {
      width: '86%',
      height: '100%',
      alignSelf: 'flex-end',
    },
  });
};

export default MenuSidebarDrawer;
