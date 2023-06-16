import React, { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import SeriesItem from './components/SeriesItem';
import { IPost, PostType } from '~/interfaces/IPost';
import useRelatedContentsInSeriesStore from './store';
import postsSelector from '~/store/entities/posts/selectors';
import usePostsStore from '~/store/entities/posts';

type RelatedContentsInSeriesProps = {
    postId: string;
}

const RelatedContentsInSeries: FC<RelatedContentsInSeriesProps> = ({ postId }) => {
  const theme = useTheme();
  const styles = createStyle(theme);

  const post: IPost = usePostsStore(postsSelector.getPost(postId));
  const { series } = post || {};
  const seriesIds = series?.map((item) => item.id) || [];

  const data = useRelatedContentsInSeriesStore((state) => state.data);
  const relatedContentsInSeriesStoreActions = useRelatedContentsInSeriesStore((state) => state.actions);
  const resetRelatedContentsInSeriesStore = useRelatedContentsInSeriesStore((state) => state.reset);

  useEffect(() => {
    if (postId && seriesIds.length > 0) {
      relatedContentsInSeriesStoreActions.getContentsInSeries(seriesIds);
    }
    return resetRelatedContentsInSeriesStore;
  }, [postId]);

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text.H4 useI18n style={styles.textTitle}>
            series:this_content_is_in_the_following_series
          </Text.H4>
        </View>
        {data.map((item, index) => (
          <SeriesItem key={item.id} postId={postId} series={item} isDefaultExpand={index === 0} />
        ))}
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      borderTopColor: colors.neutral5,
      borderBottomColor: colors.neutral5,
      borderTopWidth: 1,
      borderBottomWidth: 1,
    },
    contentContainer: {
      paddingHorizontal: spacing.padding.large,
    },
    titleContainer: {
      paddingVertical: spacing.padding.base,
    },
    textTitle: {
      color: colors.neutral80,
    },
  });
};

export default RelatedContentsInSeries;
