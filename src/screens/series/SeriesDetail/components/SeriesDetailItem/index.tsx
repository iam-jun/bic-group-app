import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { IPost, PostType } from '~/interfaces/IPost';
import { spacing } from '~/theme';
import TitleItem from './TitleItem';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import ContentItem from './ContentItem';
import { useRootNavigation } from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { Button } from '~/baseComponents';
import { TrackingEventContentReadAction, TrackingEventContentReadProperties, TrackingEventType } from '~/interfaces/ITrackingEvent';
import { trackEvent } from '~/services/tracking';

type SeriesDetailItemProps = {
    item: IPost;
    index: number;
    seriesId: string;
    isActor: boolean;
}

const SeriesDetailItem: FC<SeriesDetailItemProps> = ({
  item, index, seriesId, isActor,
}) => {
  const theme = useTheme();
  const styles = createStyle(theme);

  const { rootNavigation } = useRootNavigation();

  const goToArticleContentDetail = () => {
    rootNavigation.navigate(articleStack.articleContentDetail, { articleId: item?.id });

    // tracking event
    const eventContentReadProperties: TrackingEventContentReadProperties = {
      content_type: PostType.ARTICLE,
      action: TrackingEventContentReadAction.SERIES_ITEM,
    };
    trackEvent({ event: TrackingEventType.CONTENT_READ, properties: eventContentReadProperties });
  };

  const goToPostDetail = () => {
    rootNavigation.navigate(homeStack.postDetail, { post_id: item?.id });

    // tracking event
    const eventContentReadProperties: TrackingEventContentReadProperties = {
      content_type: PostType.POST,
      action: TrackingEventContentReadAction.SERIES_ITEM,
    };
    trackEvent({ event: TrackingEventType.CONTENT_READ, properties: eventContentReadProperties });
  };

  const onRedirect = () => {
    if (item?.type === PostType.ARTICLE) {
      goToArticleContentDetail();
    } else {
      goToPostDetail();
    }
  };

  return (
    <Button
      style={styles.container}
      onPress={onRedirect}
      testID="series_detail.list_item.item"
    >
      <TitleItem index={index} item={item} seriesId={seriesId} isActor={isActor} />
      <ViewSpacing height={spacing.margin.extraLarge} />
      <ContentItem item={item} />
    </Button>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      padding: spacing.padding.large,
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray1,
    },
  });
};

export default SeriesDetailItem;
