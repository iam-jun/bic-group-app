import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Text from '~/beinComponents/Text';
import groupsKeySelector from '../redux/keySelector';
import {useKeySelector} from '~/hooks/selector';
import CommunityItem from '../components/CommunityItem';

interface CommunitySearchResultsProps {
  onLoadMore?: () => void;
  onPressCommunity: (id: number) => void;
  onRefresh?: () => void;
}

const CommunitySearchResults = ({
  onLoadMore,
  onPressCommunity,
  onRefresh,
}: CommunitySearchResultsProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const {loading, canLoadMore, ids, items} = useKeySelector(
    groupsKeySelector.communitySearch,
  );

  const renderItem = ({item}: {item: number}) => {
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
          color={theme.colors.textSecondary}
          useI18n
          testID="community_search_results.no_results">
          common:text_search_no_results
        </Text.BodyS>
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
    if (!loading && canLoadMore && ids.length > 0)
      return (
        <View style={styles.listFooter}>
          <ActivityIndicator testID="community_search_results.loading_more" />
        </View>
      );

    return null;
  };

  return (
    <FlatList
      testID="flatlist"
      data={ids}
      renderItem={renderItem}
      keyExtractor={(item, index) => `search_item_${item}?.id_${index}`}
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
      marginVertical: 60,
      marginHorizontal: 60,
    },
    listFooter: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noResultText: {textAlign: 'center'},
  });
};

export default CommunitySearchResults;
