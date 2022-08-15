import React, { useEffect } from 'react';
import {
  FlatList, StyleSheet, ActivityIndicator, View, RefreshControl, ListRenderItem,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import EmptyScreen from '~/components/EmptyScreen';
import { useKeySelector } from '~/hooks/selector';
import groupsActions from '~/storeRedux/groups/actions';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import Divider from '~/beinComponents/Divider';
import spacing from '~/theme/spacing';
import CommunityGroupCard from '~/components/CommunityGroupCard'

const Index = () => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const data = useKeySelector(groupsKeySelector.discoverCommunitiesData);

  const {
    ids, items, loading, canLoadMore,
  } = data || {};

  const renderEmptyComponent = () => {
    if (canLoadMore) {
      return null;
    }

    return (
      <EmptyScreen
        source="addUsers"
        title="communities:empty_communities:title"
        description="communities:empty_communities:description"
      />
    );
  };

  const renderListFooter = () => {
    if (loading) return null;

    return (
      canLoadMore
      && ids.length > 0 && (
        <View
          style={styles.listFooter}
          testID="discover_communities.loading_more_indicator"
        >
          <ActivityIndicator />
        </View>
      )
    );
  };

  const getData = (params?: {
    isRefreshing?: boolean;
    refreshNoLoading?: boolean;
  }) => {
    const { isRefreshing, refreshNoLoading } = params || {};
    dispatch(groupsActions.getDiscoverCommunities({ isRefreshing, refreshNoLoading }));
  };

  const onLoadMore = () => {
    canLoadMore && getData();
  };

  const onRefresh = () => {
    getData({ isRefreshing: true });
  };

  const renderItem: ListRenderItem<number> = ({ item, index }) => {
    const currentItem = items[item];

    return (
      <CommunityGroupCard
        item={currentItem}
        testID={`discover_communities_item_${index}`}
      />
    );
  };

  useEffect(
    () => {
      getData({ refreshNoLoading: true });
    }, [],
  );

  return (
    <FlatList
      testID="flatlist"
      data={ids}
      renderItem={renderItem}
      keyExtractor={(
        item, index,
      ) => `community_${item}_${index}`}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={renderListFooter}
      onEndReached={onLoadMore}
      ItemSeparatorComponent={() => <Divider color="transparent" size={spacing.padding.large} />}
      ListHeaderComponent={() => <Divider color="transparent" size={spacing.padding.large} />}
      refreshControl={(
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor={theme.colors.gray40}
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  listFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Index;
