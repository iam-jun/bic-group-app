import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Tab from '~/baseComponents/Tab';
import spacing from '~/theme/spacing';
import { homeHeaderTabHeight, homeHeaderContentContainerHeight } from '~/theme/dimension';
import { HEADER_CONTENT_FEED_FILTER, HEADER_ATTRIBUTE_FEED_FILTER } from '~/constants/feed';
import { AttributeFeed, ContentFeed } from '~/interfaces/IFeed';

interface FilterFeedButtonGroupProps {
  contentFilter: ContentFeed;
  attributeFilter: AttributeFeed;
  onPressContentFilterTab: any;
  onPressAttributeFilterTab: any;
}

const FilterFeedButtonGroup: React.FC<FilterFeedButtonGroupProps> = ({
  contentFilter,
  attributeFilter,
  onPressContentFilterTab,
  onPressAttributeFilterTab,
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const activeContentFilter = HEADER_CONTENT_FEED_FILTER.findIndex(
    (item) => item.id === contentFilter,
  );
  const activeAttributeFilter = HEADER_ATTRIBUTE_FEED_FILTER.findIndex(
    (item) => item.id === attributeFilter,
  );

  return (
    <View style={styles.container}>
      <View style={styles.attributeContainer}>
        <Tab
          style={[styles.tabs, { marginBottom: -spacing.padding.tiny }]}
          buttonProps={{
            size: 'small', type: 'primary', useI18n: true, style: styles.attributeTab,
          }}
          data={HEADER_ATTRIBUTE_FEED_FILTER}
          onPressTab={onPressAttributeFilterTab}
          activeIndex={activeAttributeFilter}
        />
      </View>
      <View style={styles.contentContainer}>
        <Tab
          style={styles.tabs}
          buttonProps={{
            size: 'medium', useI18n: true, style: styles.contentFilterTab,
          }}
          data={HEADER_CONTENT_FEED_FILTER}
          type="pill"
          onPressTab={onPressContentFilterTab}
          activeIndex={activeContentFilter}
          selectedTypePillTab="primary"
          unselectedTypePillTab="neutral"
        />
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
    },
    attributeContainer: {
      height: homeHeaderTabHeight,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral2,
      marginHorizontal: spacing.margin.large,
    },
    contentFilterTab: {
      marginLeft: spacing.margin.small,
    },
    tabs: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'row',
      marginLeft: -spacing.margin.small,
    },
    contentContainer: {
      height: homeHeaderContentContainerHeight,
      paddingHorizontal: spacing.padding.large,
    },
    attributeTab: {
      marginLeft: spacing.margin.small,
      paddingHorizontal: spacing.padding.small,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default FilterFeedButtonGroup;
