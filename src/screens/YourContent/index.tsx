import React, { useState } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import spacing from '~/theme/spacing';
import Tab from '~/baseComponents/Tab';
import Header from '~/beinComponents/Header';
import ScheduledArticles from './components/ScheduledArticles';

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

const YourContent = () => {
  const theme = useTheme();
  const styles = createStyle(theme);
  // in this sprint default tab is Schedule Article
  const [activeTab, setActiveTab] = useState<number>(1);

  const onPressTab = (item: any, index: number) => {
    setActiveTab(index);
  };

  const renderContent = () => {
    if (activeTab === 0) {
      // render Draft
    }

    if (activeTab === 1) {
      return (<ScheduledArticles />);
    }

    if (activeTab === 2) {
      // render Reported Content
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <Header
        removeBorderAndShadow
        title="menu:title_your_content"
        useI18n
        style={styles.header}
      />
      <View style={styles.content}>
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
    boxTab: {
      paddingVertical: spacing.padding.small,
      backgroundColor: colors.white,
      ...elevation,
    },
    tabs: {
      alignItems: 'center',
      paddingHorizontal: spacing.margin.large,
    },
  });
};

export default YourContent;
