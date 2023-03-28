import React, {
  useEffect, useState,
} from 'react';
import {
  Platform, View, StyleSheet, Dimensions,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { throttle } from 'lodash';

import spacing from '~/theme/spacing';
import Tab from '~/baseComponents/Tab';
import Header from '~/beinComponents/Header';
import ScheduledArticles from './components/ScheduledArticles';
import ReportedContents from './components/ReportedContents';
import Draft from './components/Draft';
import useReportContentStore from '~/components/Report/store';
import useYourContentStore from './store';
import { homeHeaderTabHeight, homeHeaderAttributeContainerHeight } from '~/theme/dimension';

const HEADER_TAB = [
  {
    id: 'your-content-tab-1',
    text: 'your_content:title_draft',
  },
  {
    id: 'your-content-tab-2',
    text: 'your_content:title_schedule_article',
  },
  {
    id: 'your-content-tab-3',
    text: 'your_content:title_report_content',
  },
];

const HEADER_DRAFT_TAB = [
  { id: 'draft-tab-1', text: 'post:draft:text_posts' },
  { id: 'draft-tab-2', text: 'post:draft:text_articles' },
];

const DeviceHeight = Dimensions.get('window').height;

interface YourContentProps {
  route?: {
    params?: {
      initTab?: number;
    };
  };
}

const YourContent: React.FC<YourContentProps> = ({ route }) => {
  const theme = useTheme();
  const styles = createStyle(theme);
  const { initTab = 1 } = route?.params || {};
  const [activeTab, setActiveTab] = useState<number>(initTab);
  const showShared = useSharedValue(1);
  const prevOffsetYShared = useSharedValue(0);

  const { clearReportedContents } = useReportContentStore((state) => state.actions);
  const { activeDraftTab } = useYourContentStore((state) => state);
  const actions = useYourContentStore((state) => state.actions);
  const reset = useYourContentStore((state) => state.reset);

  useEffect(() => () => {
    clearReportedContents();
    reset();
  }, []);

  const onPressTab = (item: any, index: number) => {
    setActiveTab(index);
  };

  const onPressDraftTab = (item: any, index: number) => {
    actions.setActiveDraftTab(index);
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

    if (isDown5Percent) {
      hide();
    } else if (isDown && offsetY > 92) {
      hide();
    }
    if (isUp5Percent) {
      show();
    } else if (isUp && offsetY < 50) {
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

  const renderContent = () => {
    if (activeTab === 0) {
      return (
        <Draft onScroll={onScrollHandler} />
      );
    }

    if (activeTab === 1) {
      return (
        <ScheduledArticles
          onScroll={onScrollHandler}
        />
      );
    }

    if (activeTab === 2) {
      return (
        <ReportedContents
          onScroll={onScrollHandler}
        />
      );
    }

    return null;
  };

  const HeaderFilter = (
    <Animated.View
      style={[styles.headerFilter, headerFilterAnimatedStyle]}
      testID="your_content.header_filter"
    >
      <View style={[styles.boxTab]}>
        <Tab
          style={styles.tabs}
          buttonProps={{ type: 'primary', useI18n: true }}
          data={HEADER_TAB}
          type="pill"
          onPressTab={onPressTab}
          activeIndex={activeTab}
        />
      </View>
      {activeTab === 0 && (
        <View style={styles.boxDraftTab}>
          <Tab
            style={styles.tabs}
            buttonProps={{
              size: 'medium', type: 'primary', useI18n: true, style: styles.attributeTab,
            }}
            data={HEADER_DRAFT_TAB}
            onPressTab={onPressDraftTab}
            activeIndex={activeDraftTab}
          />
        </View>
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Header
        removeBorderAndShadow
        title="menu:title_your_content"
        useI18n
        style={styles.header}
      />
      <View style={styles.content}>
        {HeaderFilter}
        {renderContent()}
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
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
    boxDraftTab: {
      height: homeHeaderAttributeContainerHeight,
      marginLeft: spacing.margin.large,
    },
    attributeTab: {
      paddingVertical: 0,
      borderBottomWidth: 0,
      alignItems: 'center',
    },
  });
};

export default YourContent;
