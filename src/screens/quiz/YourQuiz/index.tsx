import React, { useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { throttle } from 'lodash';

import { spacing } from '~/theme';
import { homeHeaderTabHeight, homeHeaderContentContainerHeight } from '~/theme/dimension';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Tab from '~/baseComponents/Tab';
import { ContentFeed } from '~/interfaces/IFeed';

const HEADER_TAB = [
  {
    id: 'your-content-tab-1',
    text: 'your_content:title_draft',
  },
  {
    id: 'your-content-tab-2',
    text: 'your_content:title_published',
  },
];

const HEADER_SUB_TAB = [
  { id: ContentFeed.ALL, text: 'home:title_feed_content_all' },
  { id: ContentFeed.POST, text: 'home:title_feed_content_posts' },
  { id: ContentFeed.ARTICLE, text: 'home:title_feed_content_articles' },
];

const DeviceHeight = Dimensions.get('window').height;

const YourQuiz: React.FC = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeSubTab, setActiveSubTab] = useState<number>(0);
  const showShared = useSharedValue(1);
  const prevOffsetYShared = useSharedValue(0);

  const onPressTab = (item: any, index: number) => {
    setActiveTab(index);
  };

  const onPressSubTab = (item: any, index: number) => {
    setActiveSubTab(index);
  };

  const handleScroll = throttle((offsetY: number) => {
    if (offsetY < 0) {
      return;
    }

    const isDown = offsetY - prevOffsetYShared.value > 2;
    const isDown5Percent
      = ((offsetY - prevOffsetYShared.value) * 100) / DeviceHeight >= 5;
    const isUp = prevOffsetYShared.value - offsetY > 2;
    const isUp5Percent
      = ((prevOffsetYShared.value - offsetY) * 100) / DeviceHeight >= 5;

    if (isDown5Percent || (isDown && offsetY > 92)) {
      hide();
    }
    if (isUp5Percent || (isUp && offsetY < 50)) {
      show();
    }

    prevOffsetYShared.value = offsetY;
  }, 200);

  const onScrollHandler = useAnimatedScrollHandler((event: any) => {
    const offsetY = event?.contentOffset?.y;
    runOnJS(handleScroll)(offsetY);
  });

  const headerFilterAnimatedStyle = useAnimatedStyle(() => ({
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

  const HeaderFilter = (
    <Animated.View
      style={[styles.headerFilter, headerFilterAnimatedStyle]}
      testID="your_content.header_filter"
    >
      <View style={[styles.boxTab]}>
        <Tab
          style={[styles.tabs, { marginBottom: -spacing.padding.tiny }]}
          buttonProps={{ type: 'primary', useI18n: true }}
          data={HEADER_TAB}
          onPressTab={onPressTab}
          activeIndex={activeTab}
          isScrollToIndex
        />
      </View>
      <View style={styles.boxDraftTab}>
        <Tab
          style={[styles.subTabs, { marginLeft: -spacing.margin.small }]}
          buttonProps={{
            size: 'medium', useI18n: true, style: styles.contentTab,
          }}
          data={HEADER_SUB_TAB}
          onPressTab={onPressSubTab}
          activeIndex={activeSubTab}
          type="pill"
          selectedTypePillTab="primary"
          unselectedTypePillTab="neutral"
        />
      </View>
    </Animated.View>
  );

  const renderContent = () => {
    if (activeTab === 0) {

    }

    if (activeTab === 1) {
      
    }

    return null;
  }

  return (
    <ScreenWrapper isFullView backgroundColor={colors.neutral5} testID="your_quiz.content">
      <Header
        removeBorderAndShadow
        title="quiz:title_quiz"
        useI18n
        style={styles.header}
      />
      <View style={styles.content}>
        {HeaderFilter}
        {renderContent()}
      </View>
    </ScreenWrapper>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;
  const elevation = Platform.OS === 'ios' ? elevations.e1 : null;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    header: {
      borderBottomWidth: 1,
      borderBottomColor: colors.gray5,
      paddingVertical: 0,
    },
    content: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
    headerFilter: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      backgroundColor: colors.white,
      ...elevation,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray5,
    },
    boxTab: {
      height: homeHeaderTabHeight,
      marginHorizontal: spacing.margin.large,
    },
    tabs: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    subTabs: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    boxDraftTab: {
      height: homeHeaderContentContainerHeight,
      marginHorizontal: spacing.margin.large,
      borderTopColor: colors.neutral2,
      borderTopWidth: 1,
    },
    contentTab: {
      marginLeft: spacing.margin.small,
    },
  }); 
};

export default YourQuiz;
