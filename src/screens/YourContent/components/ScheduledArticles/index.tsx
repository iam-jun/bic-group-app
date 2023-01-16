import React, { useEffect } from 'react';
import {
  FlatList, View, StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import Text from '~/baseComponents/Text';
import useScheduleArticlesStore from './store';
import { ArticleScheduleItem } from '~/components/articles';

const ScheduledArticles = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const { scheduleArticles, actions } = useScheduleArticlesStore();
  const {
    data,
    loading,
    refreshing,
    hasNextPage,
  } = scheduleArticles || {};

  useEffect(() => {
    if (data?.length === 0) {
      getData(true);
    }
  }, []);

  const getData = (isRefresh?: boolean) => {
    actions.getScheduleArticles({ isRefresh });
  };

  const onRefresh = () => {
    getData(true);
  };

  const onLoadMore = () => {
    getData(false);
  };

  const renderEmptyComponent = () => {
    if (hasNextPage) return null;

    return (
      <View style={styles.boxEmpty}>
        <Image
          resizeMode="contain"
          source={images.img_empty_search_post}
          style={styles.imgEmpty}
        />
        <Text.BodyS color={colors.neutral40} useI18n>
          your_content:text_empty
        </Text.BodyS>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <ArticleScheduleItem data={item} />
  );

  const renderHeaderComponent = () => <ViewSpacing height={spacing.margin.large} />;

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
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={renderHeaderComponent}
      ListFooterComponent={renderFooterComponent}
      ListEmptyComponent={renderEmptyComponent}
      ItemSeparatorComponent={renderSeparatorComponent}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      refreshControl={(
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.gray40}
        />
            )}
    />
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    boxFooter: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    boxEmpty: {
      backgroundColor: colors.white,
      alignItems: 'center',
      paddingTop: 32,
      paddingBottom: 48,
    },
    imgEmpty: {
      width: 100,
      aspectRatio: 1,
    },
  });
};

export default ScheduledArticles;
