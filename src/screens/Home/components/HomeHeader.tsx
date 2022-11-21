/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect } from 'react';
import {
  DeviceEventEmitter,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EdgeInsets } from 'react-native-safe-area-context/src/SafeArea.types';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import SvgIcon from '~/baseComponents/Icon/SvgIcon';

import BicHomeLogo from '../../../../assets/images/bic_home_logo.svg';
import spacing from '~/theme/spacing';
import HomeHeaderButton from '~/screens/Home/components/HomeHeaderButton';
import { homeHeaderAttributeContainerHeight, homeHeaderLogoHeight, homeHeaderTabHeight } from '~/theme/dimension';
import Tab from '~/baseComponents/Tab';
import useHomeStore from '~/screens/Home/store';
import { AttributeFeed, ContentFeed } from '../store/Interface';

export interface HomeHeaderProps {
  style?: StyleProp<ViewStyle>;
  yShared?: any;
  onPressSearch?: () => void;
  onPressChat?: () => void;
}

const HEADER_CONTENT_FEED_FILTER = [
  { id: ContentFeed.ALL, text: 'home:title_feed_content_all' },
  { id: ContentFeed.POST, text: 'home:title_feed_content_posts' },
  { id: ContentFeed.ARTICLE, text: 'home:title_feed_content_articles' },
  { id: ContentFeed.SERIES, text: 'home:title_feed_content_series' },
];

const HEADER_ATTRIBUTE_FEED_FILTER = [
  { id: AttributeFeed.ALL, text: 'home:title_feed_attritube_all' },
  { id: AttributeFeed.IMPORTANT, text: 'home:title_feed_attritube_important' },
  { id: AttributeFeed.SAVED, text: 'home:title_feed_attritube_saved' },
];

const HomeHeader: FC<HomeHeaderProps> = ({
  style,
  yShared,
  onPressSearch,
  onPressChat,
}: HomeHeaderProps) => {
  const _yShared = yShared || useSharedValue(0);
  const showShared = useSharedValue(1);

  const insets: EdgeInsets = useSafeAreaInsets();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme, insets);

  const { contentFilter, attributeFilter, actions } = useHomeStore();

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      _yShared.value,
      [0, homeHeaderLogoHeight],
      [homeHeaderLogoHeight, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(showShared.value, [0, 1], [-100, 0]),
      },
    ],
  }));

  const show = (duration = 200) => {
    showShared.value = withTiming(1, { duration });
  };

  const hide = (duration = 200) => {
    showShared.value = withTiming(0, { duration });
  };

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('showHeader', (isShow) => {
      if (!isShow) {
        hide();
      } else {
        show();
      }
    });

    return () => {
      listener?.remove?.();
    };
  }, []);

  const onPressContentFilterTab = (item: any) => {
    actions.setContentFilter(item.id);
  };

  const onPressAttributeFilterTab = (item: any) => {
    actions.setAttributeFilter(item.id);
  };

  return (
    <View style={style}>
      <View style={styles.statusBar} />
      <Animated.View style={[styles.container, containerAnimatedStyle]}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logo}>
            <SvgIcon source={BicHomeLogo} width={145} height={28} />
          </View>
        </Animated.View>
        <View style={styles.tabContainer}>
          <Tab
            style={styles.tabs}
            buttonProps={{ size: 'small', type: 'primary', useI18n: true }}
            data={HEADER_CONTENT_FEED_FILTER}
            type="pill"
            onPressTab={onPressContentFilterTab}
            activeIndex={HEADER_CONTENT_FEED_FILTER.findIndex(
              (item) => item.id === contentFilter,
            )}
          />
        </View>
        <View style={styles.attributeContainer}>
          <Tab
            style={styles.tabs}
            buttonProps={{
              size: 'small', type: 'primary', useI18n: true, style: styles.attributeTab,
            }}
            data={HEADER_ATTRIBUTE_FEED_FILTER}
            onPressTab={onPressAttributeFilterTab}
            activeIndex={HEADER_ATTRIBUTE_FEED_FILTER.findIndex(
              (item) => item.id === attributeFilter,
            )}
          />
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
  const { colors, elevations } = theme;
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
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral2,
      marginHorizontal: spacing.margin.large,
    },
    tabs: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'row',
    },
    tabButton: { marginRight: spacing.margin.small },
    headerButtonContainer: {
      position: 'absolute',
      right: spacing.margin.large,
      top: 2,
    },
    attributeContainer: {
      height: homeHeaderAttributeContainerHeight,
      paddingHorizontal: spacing.padding.small,
    },
    attributeTab: {
      paddingHorizontal: spacing.padding.small,
      paddingVertical: 0,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 0,
    },
  });
};

export default HomeHeader;
