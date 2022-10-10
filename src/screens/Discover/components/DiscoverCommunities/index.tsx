import React, { useEffect } from 'react';
import {
  FlatList, StyleSheet, ActivityIndicator, View, RefreshControl, ListRenderItem,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import EmptyScreen from '~/components/EmptyScreen';
import Divider from '~/beinComponents/Divider';
import spacing from '~/theme/spacing';
import CommunityGroupCard from '~/components/CommunityGroupCard';
import { useDiscoverCommunitiesStore } from './store';
import useCommunityController from '~/screens/communities/store';

const DiscoverCommunities = () => {
  const theme: ExtendedTheme = useTheme();

  const {
    ids, items, loading, refreshing, hasNextPage, actions,
  } = useDiscoverCommunitiesStore();

  const communityController = useCommunityController((state) => state.actions);

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

  const renderListFooter = () => {
    if (!loading) return null;

    return (
      <View
        style={styles.listFooter}
        testID="discover_communities.loading_more_indicator"
      >
        <ActivityIndicator />
      </View>
    );
  };

  const onLoadMore = () => {
    if (hasNextPage) {
      actions.getDiscoverCommunities();
    }
  };

  const onRefresh = () => {
    actions.getDiscoverCommunities(true);
  };

  const handleJoin = (id: string, name: string) => {
    communityController.joinCommunity(id, name);
  };

  const handleCancel = (id: string, name: string) => {
    communityController.cancelJoinCommunity(id, name);
  };

  const renderItem: ListRenderItem<string> = ({ item, index }) => {
    const currentItem = items[item];

    return (
      <CommunityGroupCard
        item={currentItem}
        testID={`discover_communities_item_${index}`}
        onJoin={handleJoin}
        onCancel={handleCancel}
      />
    );
  };

  useEffect(
    () => {
      if (ids.length === 0) {
        actions.getDiscoverCommunities();
      }
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

export default DiscoverCommunities;
