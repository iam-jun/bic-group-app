import React, { useEffect } from 'react';
import {
  FlatList, StyleSheet, RefreshControl, ListRenderItem, View, ActivityIndicator,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import EmptyScreen from '~/components/EmptyScreen';
import Divider from '~/beinComponents/Divider';
import spacing from '~/theme/spacing';
import CommunityGroupCard from '~/components/CommunityGroupCard';
import { useYourCommunitiesStore } from './store';

const YourCommunities = () => {
  const theme: ExtendedTheme = useTheme();

  const {
    loading, refreshing, ids, items, hasNextPage, actions,
  } = useYourCommunitiesStore();

  useEffect(
    () => {
      if (ids.length === 0) {
        actions.getYourCommunities();
      }
    }, [],
  );

  const onLoadMore = () => {
    if (hasNextPage) {
      actions.getYourCommunities();
    }
  };

  const onRefresh = () => {
    actions.getYourCommunities(true);
  };

  const renderEmptyComponent = () => {
    if (hasNextPage) {
      return null;
    }

    return (
      <EmptyScreen
        icon="addUsers"
        title="communities:empty_communities:title"
        description="communities:empty_communities:description"
      />
    );
  };

  const renderItem: ListRenderItem<string> = ({ item, index }) => {
    const currentItem = items[item];
    return (
      <CommunityGroupCard
        item={currentItem}
        testID={`your_communities_item_${index}`}
      />
    );
  };

  const renderListFooter = () => {
    if (!loading) return null;

    return (
      <View style={styles.listFooter}>
        <ActivityIndicator testID="your_communites.loading_more" />
      </View>
    );
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
          refreshing={refreshing}
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
