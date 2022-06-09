import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';

import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import MemberItem from './MemberItem';

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
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const {loading, canLoadMore, data} = memberSearchData;

  const renderItem = ({item}: {item: any}) => {
    return (
      <MemberItem
        item={item}
        canManageMember={canManageMember}
        onPressMenu={onPressMenu}
      />
    );
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={styles.textNoResults}>
        <Text.Body
          color={theme.colors.textSecondary}
          useI18n
          testID="member_search_result.no_results">
          common:text_no_results_found
        </Text.Body>
      </View>
    );
  };

  const renderHeaderComponent = () => {
    return (
      <View style={styles.textSearchResults}>
        <Text.BodyM useI18n>common:text_search_results</Text.BodyM>
      </View>
    );
  };

  const renderListFooter = () => {
    if (!loading && canLoadMore && data.length > 0)
      return (
        <View style={styles.listFooter}>
          <ActivityIndicator testID="member_search_result.loading_more" />
        </View>
      );

    return null;
  };

  return (
    <FlatList
      testID="flatlist"
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => `search_item_${item}_${index}`}
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
            tintColor={theme.colors.borderDisable}
          />
        ) : undefined
      }
      ItemSeparatorComponent={() => <ViewSpacing height={4} />}
    />
  );
};

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    textSearchResults: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.base,
    },
    textNoResults: {
      alignItems: 'center',
      marginVertical: 100,
    },
    listFooter: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default MemberSearchResult;
