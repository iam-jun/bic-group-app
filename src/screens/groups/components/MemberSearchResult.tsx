import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import MemberItem from './MemberItem';
import spacing from '~/theme/spacing';
import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

interface MemberSearchResultProps {
  canManageMember: boolean;
  memberSearchData: {loading: boolean; canLoadMore: boolean; data: any[]};
  isAdminRole: boolean;
  onLoadMore: () => void;
  onPressMenu: (item: any) => void;
}

const MemberSearchResult = ({
  canManageMember,
  memberSearchData,
  isAdminRole,
  onLoadMore,
  onPressMenu,
}: MemberSearchResultProps) => {
  const insets = useSafeAreaInsets();

  const { loading, canLoadMore, data } = memberSearchData;

  const renderItem = ({ item }: {item: any}) => (
    <MemberItem
      item={item}
      isAdminRole={isAdminRole}
      canManageMember={canManageMember}
      onPressMenu={onPressMenu}
    />
  );

  const renderEmptyComponent = () => {
    if (loading) return <LoadingIndicator />;
    return <NoSearchResultsFound />;
  };

  const renderListFooter = () => {
    if (!loading && canLoadMore && data.length > 0) {
      return (
        <View style={styles.listFooter}>
          <ActivityIndicator testID="member_search_result.loading_more" />
        </View>
      );
    }

    return <ViewSpacing height={insets.bottom || spacing.padding.large} />;
  };

  const renderItemSeparatorComponent = () => (
    <ViewSpacing height={spacing.margin.small} />
  );

  return (
    <FlatList
      testID="flatlist"
      data={data}
      style={styles.list}
      renderItem={renderItem}
      keyExtractor={(
        item, index,
      ) => `search_item_${item}_${index}`}
      ListFooterComponent={renderListFooter}
      ListEmptyComponent={renderEmptyComponent}
      showsVerticalScrollIndicator={false}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      ItemSeparatorComponent={renderItemSeparatorComponent}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    marginVertical: spacing.margin.large,
  },
  textSearchResults: {
    marginHorizontal: spacing.margin.large,
    marginVertical: spacing.margin.base,
  },
  textNoResults: {
    alignItems: 'center',
    margin: spacing.margin.large,
  },
  listFooter: {
    marginBottom: spacing.margin.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MemberSearchResult;
