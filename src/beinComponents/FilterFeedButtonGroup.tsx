import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Tab from '~/baseComponents/Tab';
import spacing from '~/theme/spacing';
import { homeHeaderTabHeight, homeHeaderAttributeContainerHeight } from '~/theme/dimension';
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
      <View style={styles.tabContainer}>
        <Tab
          style={styles.tabs}
          buttonProps={{ size: 'small', type: 'primary', useI18n: true }}
          data={HEADER_CONTENT_FEED_FILTER}
          type="pill"
          onPressTab={onPressContentFilterTab}
          activeIndex={activeContentFilter}
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
          activeIndex={activeAttributeFilter}
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
    tabContainer: {
      height: homeHeaderTabHeight,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral2,
      marginHorizontal: spacing.margin.large,
    },
    tabs: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'row',
    },
    attributeContainer: {
      height: homeHeaderAttributeContainerHeight,
      paddingHorizontal: spacing.padding.large,
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

export default FilterFeedButtonGroup;
