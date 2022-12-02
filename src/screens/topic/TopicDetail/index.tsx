import React, { useEffect } from 'react';
import {
  ActivityIndicator, View, StyleSheet, FlatList, RefreshControl,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import useTopicStore from '../store';

import Header from '~/beinComponents/Header';
import TopicDetailArticleItem from './components/TopicDetailArticleItem';
import Divider from '~/beinComponents/Divider';
import spacing from '~/theme/spacing';

const TopicDetail: React.FC<any> = ({ route }) => {
  const { params } = route || {};
  const { topicId } = params || {};
  const theme = useTheme();
  const styles = createStyle(theme);
  const {
    topicDetail,
    articles,
    actions,
    reset,
  } = useTopicStore();
  const { data, loading, refreshing } = articles || {};

  useEffect(() => {
    getData(true);

    return () => {
      reset();
    };
  }, []);

  const getData = (isRefresh?: boolean) => {
    actions.getTopicDetail(topicId);
    actions.getArticleTopicDetail({ isRefresh, id: topicId });
  };

  const onRefresh = () => {
    getData(true);
  };

  const onLoadMore = () => {
    actions.getArticleTopicDetail({ isRefresh: false, id: topicId });
  };

  const onRightPress = () => {
    // do something
  };

  const _renderItem = ({ item }) => (
    <TopicDetailArticleItem article={item} />
  );

  const _keyExtractor = (item) => `artc-topic-detail-${item?.id}`;

  const _renderHeaderComponent = () => <Divider color="transparent" size={spacing.padding.base} />;

  const _renderFooterComponent = () => {
    if (!loading) return <Divider color="transparent" size={spacing.padding.large} />;

    return (
      <View style={styles.boxFooter}>
        <ActivityIndicator />
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <Header
        rightIcon="BarsSort"
        title={topicDetail?.name}
        onRightPress={onRightPress}
      />
      <FlatList
        data={data}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
        ListHeaderComponent={_renderHeaderComponent}
        ListFooterComponent={_renderFooterComponent}
        onEndReachedThreshold={0.2}
        onEndReached={onLoadMore}
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.gray40}
          />
                )}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
    boxFooter: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default TopicDetail;
