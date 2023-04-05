import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import React, { FC } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import ViewSpacing from '~/beinComponents/ViewSpacing';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import SearchDiscoverCommunityItem from './SearchDiscoverCommunityItem';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import useDiscoverCommunitiesSearchStore from './store';
import useCommunityController from '~/screens/communities/store';
import useCommunitiesStore from '~/store/entities/communities';
import useTermStore from '~/components/TermsModal/store';
import useMemberQuestionsStore, { MembershipQuestionsInfo } from '~/components/MemberQuestionsModal/store';

interface SearchDiscoverCommunityResultsProps {
  onLoadMore?: () => void;
}

type SearchDiscoverCommunityItemContainerProps = {
  id: string;
  onView: (item: any) => void;
  onJoin: (item: any) => void;
  onCancel: (item: any) => void;
};

const SearchDiscoverCommunityItemContainer: FC<
  SearchDiscoverCommunityItemContainerProps
> = ({
  id, onView, onJoin, onCancel,
}) => {
  const item = useCommunitiesStore((state) => state.data[id]);
  return (
    <SearchDiscoverCommunityItem
      testID="global_search_results.item"
      item={item}
      onView={onView}
      onJoin={onJoin}
      onCancel={onCancel}
    />
  );
};

const SearchDiscoverCommunityResults = ({
  onLoadMore,
}: SearchDiscoverCommunityResultsProps) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();

  const { hasNextPage, loading, ids } = useDiscoverCommunitiesSearchStore();

  const communityController = useCommunityController((state) => state.actions);
  const membershipQuestionActions = useMemberQuestionsStore((state) => state.actions);
  const termsActions = useTermStore((state) => state.actions);

  const onView = (item: any) => {
    rootNavigation.navigate(groupStack.communityDetail, {
      communityId: item.id,
    });
  };

  const onJoin = (item: any) => {
    const {
      id, name, settings, groupId,
    } = item;
    if (settings?.isActiveMembershipQuestions) {
      const payload: MembershipQuestionsInfo = {
        groupId: id,
        rootGroupId: groupId,
        name,
        type: 'community',
        isActive: true,
        isActiveGroupTerms: settings?.isActiveGroupTerms,
      };
      membershipQuestionActions.setMembershipQuestionsInfo(payload);
      return;
    }

    if (settings?.isActiveGroupTerms) {
      const payload = {
        groupId: id,
        rootGroupId: groupId,
        name,
        type: 'community',
        isActive: true,
      } as any;
      termsActions.setTermInfo(payload);
      return;
    }
    communityController.joinCommunity(id, name);
  };

  const onCancel = (item: any) => {
    const { id, name } = item;
    communityController.cancelJoinCommunity(id, name);
  };

  const renderItem: ListRenderItem<string> = ({ item }) => (
    <SearchDiscoverCommunityItemContainer
      id={item}
      onView={onView}
      onJoin={onJoin}
      onCancel={onCancel}
    />
  );

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
      testID="community_search_results.list"
      data={ids}
      keyboardShouldPersistTaps="handled"
      renderItem={renderItem}
      keyExtractor={(item, index) => `search_item_${item}?.id_${index}`}
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
