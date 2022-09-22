import React, { useEffect } from 'react';
import {
  FlatList, StyleSheet, RefreshControl, ListRenderItem, View, ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import EmptyScreen from '~/components/EmptyScreen';
import { useKeySelector } from '~/hooks/selector';
import groupsActions from '~/storeRedux/groups/actions';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import Divider from '~/beinComponents/Divider';
import spacing from '~/theme/spacing';
import DiscoverCard from '~/components/DiscoverCard';

const YourCommunities = () => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();

  const {
    loading, ids, items, canLoadMore,
  } = useKeySelector(groupsKeySelector.joinedCommunities);

  useEffect(() => {
    getData({ refreshNoLoading: true });
  }, []);

  const getData = (params?: {
    isRefreshing?: boolean;
    refreshNoLoading?: boolean;
  }) => {
    const { isRefreshing, refreshNoLoading } = params || {};
    dispatch(groupsActions.getMyCommunities({ isRefreshing, refreshNoLoading }));
  };

  const onLoadMore = () => {
    canLoadMore && getData();
  };

  const onRefresh = () => {
    getData({ isRefreshing: true });
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <EmptyScreen
        icon="addUsers"
        title="communities:empty_communities:title"
        description="communities:empty_communities:description"
      />
    );
  };

  const renderItem: ListRenderItem<number> = ({ item, index }) => {
    const currentItem = items[item];
    return (
      <DiscoverCard
        item={currentItem}
        testID={`your_communities_item_${index}`}
      />
    );
  };

  const renderListFooter = () => {
    if (!loading && canLoadMore && ids.length > 0) {
      return (
        <View style={styles.listFooter}>
          <ActivityIndicator testID="your_communites.loading_more" />
        </View>
      );
    }

    return null;
  };

  return (
    <FlatList
      testID="flatlist"
      data={ids}
      renderItem={renderItem}
      keyExtractor={(
        item, index,
      ) => `community_${item}_${index}`}
      ListHeaderComponent={() => <Divider color="transparent" size={spacing.padding.large} />}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={renderListFooter}
      ItemSeparatorComponent={() => <Divider color="transparent" size={spacing.padding.large} />}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      refreshControl={(
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor={theme.colors.gray40}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  listFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default YourCommunities;
