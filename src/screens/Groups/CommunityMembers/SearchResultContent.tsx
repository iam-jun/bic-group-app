import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';

import {ICommunityMembers} from '~/interfaces/ICommunity';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import MemberItem from '../components/MemberItem';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import ViewSpacing from '~/beinComponents/ViewSpacing';

interface SearchResultContentProps {
  canManageMember: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
}

const SearchResultContent = ({
  canManageMember,
  onLoadMore,
  onRefresh,
}: SearchResultContentProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const {loading, canLoadMore, data} = useKeySelector(
    groupsKeySelector.communitySearchMembers,
  );

  const renderItem = ({item}: {item: ICommunityMembers}) => {
    return <MemberItem item={item} canManageMember={canManageMember} />;
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={styles.textNoResults}>
        <Text.Body
          color={theme.colors.textSecondary}
          useI18n
          testID="search_result_content.no_results">
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
          <ActivityIndicator testID="search_result_content.loading_more" />
        </View>
      );

    return null;
  };

  return (
    <FlatList
      testID="flatlist"
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => `result_item_${item}_${index}`}
      ListHeaderComponent={renderHeaderComponent}
      ListFooterComponent={renderListFooter}
      ListEmptyComponent={renderEmptyComponent}
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
    listFooter: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textSearchResults: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.base,
    },
    textNoResults: {
      alignItems: 'center',
      marginVertical: 100,
    },
  });
};

export default SearchResultContent;
