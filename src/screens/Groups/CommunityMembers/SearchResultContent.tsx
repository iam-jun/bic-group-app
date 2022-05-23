import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';

import {ICommunityMembers} from '~/interfaces/ICommunity';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {Divider, useTheme} from 'react-native-paper';
import MemberItem from '../components/MemberItem';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';

interface SearchResultContentProps {
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onPressChat?: () => void;
}

const SearchResultContent = ({
  onLoadMore,
  onRefresh,
  onPressChat,
}: SearchResultContentProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const {loading, canLoadMore, data} = useKeySelector(
    groupsKeySelector.searchMembers,
  );

  const renderItem = ({item}: {item: ICommunityMembers}) => {
    return <MemberItem item={item} onPressChat={onPressChat} />;
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={styles.textNoResults}>
        <Text.Body color={theme.colors.textSecondary} useI18n>
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
      ItemSeparatorComponent={() => <Divider style={styles.divider} />}
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
    divider: {
      marginVertical: spacing.margin.tiny,
      marginHorizontal: spacing.margin.large,
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
