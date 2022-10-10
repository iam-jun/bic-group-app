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
import CommunityItem from '~/screens/groups/components/CommunityItem';
import spacing from '~/theme/spacing';
import { useRootNavigation } from '~/hooks/navigation';
import { useSearchJoinedCommunitiesStore } from './store';
import { isGroup } from '~/screens/groups/helper';
import ICommunitiesState from '~/store/comunities/Interface';
import useCommunitiesStore from '~/store/comunities';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';

interface CommunitySearchResultsProps {
  onLoadMore?: () => void;
  onRefresh?: () => void;
}

const CommunitySearchResults = ({
  onLoadMore,
}: CommunitySearchResultsProps) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();

  const {
    loading, hasNextPage, ids, items,
  } = useSearchJoinedCommunitiesStore();
  const actions = useCommunitiesStore((state: ICommunitiesState) => state.actions);

  const onPressCommunity = (communityId: string) => {
    const item = items[communityId];
    const { level, id, community } = item;

    if (isGroup(level)) {
      // in group detail we need some infomation from community detail,
      // so before navigate to group detail we need to fetch community detail
      actions.getCommunity(community.id);

      rootNavigation.navigate(
        groupStack.groupDetail,
        {
          groupId: id,
        },
      );
      return;
    }

    // if a community has community field (manage api, /me/search/groups)
    // so need to pick id from community field
    // otherwise pick id by normal
    rootNavigation.navigate(
      groupStack.communityDetail,
      { communityId: community ? community.id : id },
    );
  };

  const renderItem = ({ item }: {item: string}) => {
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

export default CommunitySearchResults;
