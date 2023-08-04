import React, { FC, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';

import DescriptionSection from './DescriptionSection';
import TitleSection from './TitleSection';
import ListItem from './ListItem';

import { spacing } from '~/theme';
import { Button } from '~/baseComponents';
import { ContentInterestedUserCount } from '~/components/ContentView';
import { useRootNavigation } from '~/hooks/navigation';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { IPost, PostType } from '~/interfaces/IPost';
import { trackEvent } from '~/services/tracking';
import { TrackingEventContentReadProperties } from '~/services/tracking/Interface';
import { TrackingEventContentReadAction, TrackingEventType } from '~/services/tracking/constants';

const LIMIT_ITEM = 3;

type SeriesContentProps = {
  series: IPost;
  isLite?: boolean;
};

const SeriesContent: FC<SeriesContentProps> = ({ series, isLite }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const {
    id,
    title,
    updatedAt,
    coverMedia,
    summary,
    totalUsersSeen,
    items,
    titleHighlight,
    summaryHighlight,
  } = series || {};
  const { rootNavigation } = useRootNavigation();
  const [itemShowAll, setItemShowAll] = useState(false);
  const listItem = itemShowAll ? items : items?.slice?.(0, LIMIT_ITEM);
  const titleSection = isLite && titleHighlight ? titleHighlight : title;
  const summarySection = isLite && summaryHighlight ? summaryHighlight : summary;

  const goToSeriesDetail = () => {
    rootNavigation.navigate(seriesStack.seriesDetail, { seriesId: id });

    // tracking event
    const eventContentReadProperties: TrackingEventContentReadProperties = {
      content_type: PostType.SERIES,
      action: TrackingEventContentReadAction.BODY,
    };
    trackEvent({ event: TrackingEventType.CONTENT_READ, properties: eventContentReadProperties });
  };

  const onToggleShowItem = () => {
    setItemShowAll(!itemShowAll);
    // tracking event
    if (itemShowAll) {
      const eventContentReadProperties: TrackingEventContentReadProperties = {
        content_type: PostType.SERIES,
        action: TrackingEventContentReadAction.SEE_MORE,
      };
      trackEvent({ event: TrackingEventType.CONTENT_READ, properties: eventContentReadProperties });
    }
  };

  const renderListItem = () => (
    <ListItem
      listItem={listItem}
    />
  );

  const renderRowOptions = () => (
    <View style={[styles.default, items?.length > LIMIT_ITEM && styles.row, !!isLite && styles.rowLite]}>
      {items?.length > LIMIT_ITEM && (
        <Text.SubtitleM
          testID="series_content.short_content"
          onPress={onToggleShowItem}
          color={colors.neutral60}
          useI18n
        >
          {itemShowAll
            ? 'common:text_see_less'
            : 'common:text_see_more'}
        </Text.SubtitleM>
      )}
      <ContentInterestedUserCount
        id={id}
        interestedUserCount={totalUsersSeen}
        style={styles.interestedUserCount}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Button onPress={goToSeriesDetail}>
        <TitleSection
          title={titleSection}
          time={updatedAt}
          numberOfItems={items?.length || 0}
          img={coverMedia?.url}
        />
      </Button>
      <DescriptionSection description={summarySection} />
      {renderListItem()}
      {renderRowOptions()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.padding.small,
    paddingHorizontal: spacing.padding.large,
    paddingBottom: spacing.padding.xSmall,
  },
  default: {
    paddingVertical: spacing.padding.base,
    marginTop: spacing.margin.base,
  },
  row: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  interestedUserCount: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    margin: 0,
    alignItems: 'flex-end',
  },
  rowLite: {
    paddingVertical: 0,
  },
});

export default SeriesContent;
