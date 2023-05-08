import React, { useEffect } from 'react';
import {
  View, StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';
import Image from '~/components/Image';
import images from '~/resources/images';
import Text from '~/baseComponents/Text';
import useScheduleArticlesStore from './store';
import { ArticleScheduleItem } from '~/components/articles';
import { homeHeaderTabHeight } from '~/theme/dimension';

interface ScheduledArticlesProps {
  onScroll: (e: any) => void;
}

const ScheduledArticles: React.FC<ScheduledArticlesProps> = ({ onScroll }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle();

  const { scheduleArticles, actions } = useScheduleArticlesStore();
  const {
    data,
    loading,
    refreshing,
    hasNextPage,
  } = scheduleArticles || {};

  useEffect(() => {
    getData(true);
  }, []);

  const getData = (isRefresh?: boolean) => {
    actions.getScheduleArticles({ isRefresh });
  };

  const onRefresh = () => {
    getData(true);
  };

  const onLoadMore = () => {
    if (hasNextPage) {
      getData(false);
    }
  };

  const renderEmptyComponent = () => {
    if (hasNextPage) return null;

    return (
      <View style={styles.boxEmpty} testID="schedule_article.empty_view">
        <Image
          resizeMode="contain"
          source={images.img_empty_box}
          style={styles.imgEmpty}
        />
        <Text.BodyS color={colors.neutral40} useI18n>
          your_content:text_empty
        </Text.BodyS>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <ArticleScheduleItem data={item} showAvatar={false} />
  );

  const renderHeaderComponent = () => (
    <View style={styles.header}>
      <ViewSpacing height={spacing.margin.large} />
    </View>
  );

  const renderFooterComponent = () => {
    if (!loading) return <ViewSpacing height={spacing.padding.large} />;

    return (
      <View style={styles.boxFooter}>
        <ActivityIndicator />
      </View>
    );
  };

  const keyExtractor = (item) => `schedule-article-${item?.id}`;

  const renderSeparatorComponent = () => <ViewSpacing height={spacing.margin.large} />;

  return (
    <Animated.FlatList
      testID="schedule_article.content"
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={renderHeaderComponent}
      ListFooterComponent={renderFooterComponent}
      ListEmptyComponent={renderEmptyComponent}
      ItemSeparatorComponent={renderSeparatorComponent}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      onScroll={onScroll}
      refreshControl={(
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.gray40}
          progressViewOffset={homeHeaderTabHeight}
        />
            )}
    />
  );
};

const createStyle = () => StyleSheet.create({
  boxFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxEmpty: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 48,
  },
  imgEmpty: {
    width: 100,
    aspectRatio: 1,
    marginBottom: spacing.margin.base,
  },
  header: {
    paddingTop: homeHeaderTabHeight,
  },
});

export default ScheduledArticles;
