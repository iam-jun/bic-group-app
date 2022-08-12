import React, { FC, useEffect } from 'react';
import {
  DeviceEventEmitter, StyleProp,
  StyleSheet, View, ViewStyle,
} from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EdgeInsets } from 'react-native-safe-area-context/src/SafeArea.types';
import Animated, {
  Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming,
} from 'react-native-reanimated';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';

import BicHomeLogo from '~/../assets/images/bic_home_logo.svg';
import spacing from '~/theme/spacing';
import PillTabButton from '~/bicComponents/Tab/PillTabButton';
import { useBaseHook } from '~/hooks';
import HomeHeaderButton from '~/screens/Home/Newsfeed/components/HomeHeaderButton';
import { homeHeaderLogoHeight, homeHeaderTabHeight } from '~/theme/dimension';

export interface HomeHeaderProps {
  style?: StyleProp<ViewStyle>;
  yShared?: any,
  onPressSearch?: () => void;
  onPressChat?: () => void;
}

const HomeHeader: FC<HomeHeaderProps> = ({
  style, yShared, onPressSearch, onPressChat,
}: HomeHeaderProps) => {
  const _yShared = yShared || useSharedValue(0)
  const showShared = useSharedValue(1)

  const { t } = useBaseHook();
  const insets: EdgeInsets = useSafeAreaInsets();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme, insets);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(_yShared.value,
      [0, homeHeaderLogoHeight],
      [homeHeaderLogoHeight, 0],
      Extrapolation.CLAMP),
  }))

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY:
        interpolate(showShared.value, [0, 1], [-100, 0]),
    }],
  }))

  const show = (duration = 200) => {
    showShared.value = withTiming(
      1, { duration },
    );
  };

  const hide = (duration = 200) => {
    showShared.value = withTiming(
      0, { duration },
    );
  };

  useEffect(
    () => {
      const listener = DeviceEventEmitter.addListener(
        'showHeader', (isShow) => {
          if (!isShow) { hide() } else { show() }
        },
      );

      return () => {
        listener?.remove?.();
      };
    }, [],
  );

  return (
    <View style={style}>
      <View style={styles.statusBar} />
      <Animated.View style={[styles.container, containerAnimatedStyle]}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logo}>
            <SvgIcon source={BicHomeLogo} width={105} height={18} />
          </View>
        </Animated.View>
        <View style={styles.tabContainer}>
          <View style={styles.tabs}>
            <PillTabButton size="small" type="primary" style={styles.tabButton}>
              {t('home:title_timeline')}
            </PillTabButton>
            <PillTabButton size="small" type="primary" isSelected={false}>
              {t('home:title_important')}
            </PillTabButton>
          </View>
        </View>
        <HomeHeaderButton
          onPressSearch={onPressSearch}
          onPressChat={onPressChat}
          style={styles.headerButtonContainer}
        />
      </Animated.View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme, insets: EdgeInsets) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.neutral,
      overflow: 'hidden',
      borderBottomWidth: 0.5,
      borderColor: colors.neutral2,
    },
    statusBar: {
      backgroundColor: colors.neutral,
      height: insets.top,
    },
    logoContainer: {
      height: homeHeaderLogoHeight,
      paddingHorizontal: spacing.margin.large,
      overflow: 'hidden',
      justifyContent: 'flex-end',
    },
    logo: {
      height: homeHeaderLogoHeight,
      justifyContent: 'center',
    },
    tabContainer: {
      height: homeHeaderTabHeight,
      flexDirection: 'row',
      paddingBottom: spacing.padding.small,
    },
    tabs: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: spacing.margin.large,
      flexDirection: 'row',
    },
    tabButton: { marginRight: spacing.margin.small },
    headerButtonContainer: {
      position: 'absolute',
      right: spacing.margin.large,
      top: 2,
    },
  });
};

export default HomeHeader;
