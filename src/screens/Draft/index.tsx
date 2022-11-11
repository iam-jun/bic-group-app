import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useBaseHook } from '~/hooks';
import Header from '~/beinComponents/Header';
import Tab from '~/baseComponents/Tab';
import { spacing } from '~/theme';
import DraftPost from '~/screens/Draft/DraftPost';
import DraftArticle from '~/screens/Draft/DraftArticle';
import { DRAFT_CONTENT_TYPE } from './constants';

const HEADER_TAB = [
  { id: DRAFT_CONTENT_TYPE.DRAFT_POST, text: 'post:draft:text_posts', component: DraftPost },
  { id: DRAFT_CONTENT_TYPE.DRAFT_ARTICLES, text: 'post:draft:text_articles', component: DraftArticle },
];

const Draft = () => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const onPressTab = (item: any, index: number) => {
    setSelectedIndex(index);
  };

  const ContentComponent = HEADER_TAB[selectedIndex].component;

  return (
    <View style={styles.container}>
      <Header title={t('post:draft:title_draft')} removeBorderAndShadow />
      <View style={styles.tabContainer}>
        <Tab
          style={styles.tabs}
          buttonProps={{ size: 'medium', type: 'primary', useI18n: true }}
          data={HEADER_TAB}
          type="pill"
          onPressTab={onPressTab}
          activeIndex={selectedIndex}
        />
      </View>
      <ContentComponent />
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
    tabContainer: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.small,
      backgroundColor: colors.white,
    },
    tabs: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: spacing.margin.large,
      flexDirection: 'row',
    },
  });
};

export default Draft;
