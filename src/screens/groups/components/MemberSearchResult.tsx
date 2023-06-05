import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import ViewSpacing from '~/beinComponents/ViewSpacing';
import MemberItem from './MemberItem';
import spacing from '~/theme/spacing';
import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

interface MemberSearchResultProps {
  canManageMember: boolean;
  memberSearchData: {loading: boolean; canLoadMore: boolean; data: any[]};
  isAdminRole: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onPressMenu: (item: any) => void;
}

const MemberSearchResult = ({
  canManageMember,
  memberSearchData,
  isAdminRole,
  onLoadMore,
  onRefresh,
  onPressMenu,
}: MemberSearchResultProps) => {
  const theme: ExtendedTheme = useTheme();

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

    return null;
  };

  const renderItemSeparatorComponent = () => (
    <ViewSpacing height={8} />
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
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={theme.colors.gray40}
          />
        ) : undefined
      }
      ItemSeparatorComponent={renderItemSeparatorComponent}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    marginVertical: spacing.margin.small,
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
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgEmpty: {
    width: 150,
    aspectRatio: 1,
  },
  noResultText: {
    textAlign: 'center',
  },
});

export default MemberSearchResult;
