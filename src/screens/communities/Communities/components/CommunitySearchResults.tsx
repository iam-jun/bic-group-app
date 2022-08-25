import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import ViewSpacing from '~/beinComponents/ViewSpacing';
import Text from '~/beinComponents/Text';
import groupsKeySelector from '../../../../storeRedux/groups/keySelector';
import { useKeySelector } from '~/hooks/selector';
import CommunityItem from '../../../groups/components/CommunityItem';
import spacing from '~/theme/spacing';

interface CommunitySearchResultsProps {
  onLoadMore?: () => void;
  onPressCommunity: (id: string) => void;
  onRefresh?: () => void;
}

const CommunitySearchResults = ({
  onLoadMore,
  onPressCommunity,
  onRefresh,
}: CommunitySearchResultsProps) => {
  const theme: ExtendedTheme = useTheme();

  const {
    loading, canLoadMore, ids, items,
  } = useKeySelector(groupsKeySelector.communitySearch);

  const renderItem = ({ item }: {item: number}) => {
    const currentItem = items[item];
    return (
      <CommunityItem item={currentItem} onPressCommunities={onPressCommunity} />
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
    if (!loading && canLoadMore && ids.length > 0) {
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
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={theme.colors.gray40}
          />
        ) : undefined
      }
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

export default CommunitySearchResults;
