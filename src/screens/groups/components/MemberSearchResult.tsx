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
import Image from '~/beinComponents/Image';
import Text from '~/beinComponents/Text';
import images from '~/resources/images';

interface MemberSearchResultProps {
  canManageMember: boolean;
  memberSearchData: {loading: boolean; canLoadMore: boolean; data: any[]};
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onPressMenu: (item: any) => void;
}

const MemberSearchResult = ({
  canManageMember,
  memberSearchData,
  onLoadMore,
  onRefresh,
  onPressMenu,
}: MemberSearchResultProps) => {
  const theme: ExtendedTheme = useTheme();

  const { loading, canLoadMore, data } = memberSearchData;

  const renderItem = ({ item }: {item: any}) => (
    <MemberItem
      item={item}
      canManageMember={canManageMember}
      onPressMenu={onPressMenu}
    />
  );

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={styles.textNoResults}>
        <Image
          resizeMode="contain"
          style={styles.imgEmpty}
          source={images.img_empty_search_post}
        />
        <Text.BodyS
          style={styles.noResultText}
          color={theme.colors.neutral40}
          useI18n
          testID="member_search_result.no_results"
        >
          common:text_search_no_results
        </Text.BodyS>
      </View>
    );
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
      ItemSeparatorComponent={() => <ViewSpacing height={8} />}
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
