import React, { useCallback, useState } from 'react';

import { debounce } from 'lodash';
import {
  ActivityIndicator, FlatList, View, StyleSheet, Platform,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useKeyboard } from '@react-native-community/hooks';
import appConfig from '~/configs/appConfig';
import SearchBaseView from '~/beinComponents/SearchBaseView';
import AdvancedSettingItem from '../../components/AdvancedSettingItem';
import useBaseHook from '~/hooks/baseHook';
import useSearchJoinedCommunitiesStore from '~/screens/communities/Communities/components/SearchCommunity/store';
import EmptyScreen from '~/components/EmptyScreen';
import images from '~/resources/images';

interface SearchMemberViewProps {
  isOpen: boolean;
  onClose?: () => void;
  onPressItem: (item: any) => void;
}

const SearchCommunityView = ({
  isOpen,
  onClose,
  onPressItem,
}: SearchMemberViewProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { t } = useBaseHook();
  const keyboard = useKeyboard();

  const [searchText, setSearchText] = useState('');

  const {
    ids, items, actions: joinedActions, reset, loading, hasNextPage,
  } = useSearchJoinedCommunitiesStore();

  const onLoadMore = () => {
    hasNextPage && joinedActions.searchJoinedCommunities({ key: searchText }, true);
  };

  const searchCommunities = (searchQuery: string) => {
    reset();
    setSearchText(searchQuery);
    joinedActions.searchJoinedCommunities({ key: searchQuery }, true);
  };

  const searchHandler = useCallback(
    debounce(
      searchCommunities, appConfig.searchTriggerTime,
    ),
    [],
  );

  const onSearchCommunities = (text: string) => {
    searchHandler(text);
  };

  const renderItem = ({ item }: any) => {
    if (!item) return null;
    const currentItem = items[item];
    return (
      <AdvancedSettingItem
        item={currentItem}
        onPress={onPressItem}
      />
    );
  };

  const renderListFooter = () => {
    if (!hasNextPage) {
      return <View style={{ height: Platform?.OS === 'ios' ? (keyboard?.keyboardHeight || 0) : 0 }} />;
    }

    return (
      <View style={styles.listFooter}>
        <ActivityIndicator testID="your_communites.loading_more" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <EmptyScreen
        source={images.img_empty_search_post}
        description="common:text_search_no_results"
      />
    );
  };

  return (
    <SearchBaseView
      isOpen={isOpen}
      placeholder={t('notification:advanced_notifications_settings:search_placeholder')}
      onClose={onClose}
      onChangeText={onSearchCommunities}
    >
      <FlatList
        data={ids}
        scrollEventThrottle={16}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => `advanced_settings.search_communtiy.${item}`}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderListFooter}
        onEndReached={onLoadMore}
      />
    </SearchBaseView>
  );
};

const createStyle = (_theme: ExtendedTheme) => StyleSheet.create({
  flex1: {
    flex: 1,
  },
  listFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchCommunityView;
