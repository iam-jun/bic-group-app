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
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import {IGroupMembers} from '~/interfaces/IGroup';
import images from '~/resources/images';

interface SearchResultContentProps {
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onPressMenu: (e: any, item: IGroupMembers) => void;
}

const SearchResultContent = ({
  onLoadMore,
  onRefresh,
  onPressMenu,
}: SearchResultContentProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const {loading, canLoadMore, data} = useKeySelector(
    groupsKeySelector.groupSearchMembers,
  );

  const renderItem = ({item}: {item: IGroupMembers}) => {
    const {fullname, avatar, username} = item || {};

    return (
      <PrimaryItem
        showAvatar
        menuIconTestID={'search_result_content.item'}
        style={styles.itemContainer}
        avatar={avatar || images.img_user_avatar_default}
        ContentComponent={
          <Text.H6 numberOfLines={2}>
            {fullname}
            <Text.Subtitle
              color={
                theme.colors.textSecondary
              }>{` @${username}`}</Text.Subtitle>
          </Text.H6>
        }
        onPressMenu={(e: any) => onPressMenu(e, item)}
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
      keyExtractor={(item, index) => `search_item_${item}_${index}`}
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
    itemContainer: {
      height: undefined,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.tiny,
    },
  });
};

export default SearchResultContent;
