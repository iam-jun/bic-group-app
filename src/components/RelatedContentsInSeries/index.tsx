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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fakeData = [
  {
    id: 1,
    title: 'Toàn tập USD Coin (USDC) Toàn tập USD Coin (USDC) ',
    items: [
      {
        id: 'd735217e-1ed6-40de-8e2a-50a380d86060',
        title: 'BUSD- "Người chơi" nổi bật trong thị trường stable coin ',
        type: PostType.POST,
      },
      {
        id: 3,
        title: 'article 2',
        type: PostType.ARTICLE,
      },
      {
        id: 'd0cbc635-a92c-4783-872d-c248f5b5630c',
        title: 'article 3',
        type: PostType.ARTICLE,
      },
    ],
  },
  {
    id: 5,
    title: 'Toàn tập USD Coin (USDC) Toàn tập USD Coin (USDC)',
    items: [
      {
        id: 6,
        title: 'article 1',
      },
      {
        id: 4,
        title: 'BUSD- "Người chơi" nổi bật trong thị trường stable coin',
      },
      {
        id: 8,
        title: 'article 3',
      },
    ],
  },
];

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
        {data.map((item) => (
          <SeriesItem key={item.id} postId={postId} series={item} />
        ))}
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
    },
    contentContainer: {
      borderTopColor: colors.neutral5,
      borderTopWidth: 1,
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
