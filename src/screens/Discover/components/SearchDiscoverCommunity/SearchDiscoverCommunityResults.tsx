import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import ViewSpacing from '~/beinComponents/ViewSpacing';
import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';
import SearchDiscoverCommunityItem from './SearchDiscoverCommunityItem';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { useDiscoverCommunitiesSearchStore } from './store';
import useCommunitiesStore from '~/store/comunities';

interface SearchDiscoverCommunityResultsProps {
  onLoadMore?: () => void;
}

const SearchDiscoverCommunityResults = ({
  onLoadMore,
}: SearchDiscoverCommunityResultsProps) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();

  const {
    hasNextPage, loading, ids, items,
  } = useDiscoverCommunitiesSearchStore();

  const actionsCommunitiesStore = useCommunitiesStore((state) => state.actions);

  const onView = (item: any) => {
    rootNavigation.navigate(groupStack.communityDetail, { communityId: item.id });
  };

  const onJoin = (item: any) => {
    const { id, name } = item;
    actionsCommunitiesStore.joinCommunity(id, name);
  };

  const onCancel = (item: any) => {
    const { id, name } = item;
    actionsCommunitiesStore.cancelJoinCommunity(id, name);
  };

  const renderItem = ({ item }: {item: string}) => {
    const currentItem = items[item];
    return (
      <SearchDiscoverCommunityItem
        testID={`global_search_results.item_${currentItem.id}`}
        item={currentItem}
        onView={onView}
        onJoin={onJoin}
        onCancel={onCancel}
      />
    );
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={styles.textNoResults}>
        <Text.BodyS
          style={styles.noResultText}
          color={theme.colors.gray50}
          useI18n
          testID="community_search_results.no_results"
        >
          common:text_search_no_results
        </Text.BodyS>
      </View>
    );
  };

  const renderHeaderComponent = () => (
    <View style={styles.textSearchResults}>
      <Text.BodyM useI18n>common:text_search_results</Text.BodyM>
    </View>
  );

  const renderListFooter = () => {
    if (!loading && hasNextPage && ids.length > 0) {
      return (
        <View style={styles.listFooter}>
          <ActivityIndicator testID="community_search_results.loading_more" />
        </View>
      );
    }

    return null;
  };

  return (
    <FlatList
      testID="flatlist"
      data={ids}
      keyboardShouldPersistTaps="handled"
      renderItem={renderItem}
      keyExtractor={(
        item, index,
      ) => `search_item_${item}?.id_${index}`}
      ListHeaderComponent={renderHeaderComponent}
      ListFooterComponent={renderListFooter}
      ListEmptyComponent={renderEmptyComponent}
      showsVerticalScrollIndicator={false}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      ItemSeparatorComponent={() => <ViewSpacing height={4} />}
    />
  );
};

const styles = StyleSheet.create({
  textSearchResults: {
    marginHorizontal: spacing.margin.large,
    marginVertical: spacing.margin.base,
  },
  textNoResults: {
    alignItems: 'center',
    marginVertical: 60,
    marginHorizontal: 60,
  },
  listFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultText: { textAlign: 'center' },
});

export default SearchDiscoverCommunityResults;
