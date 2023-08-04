import React, { useCallback, useState } from 'react';

import { debounce } from 'lodash';
import {
  ActivityIndicator, FlatList, View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import appConfig from '~/configs/appConfig';
import SearchBaseView from '~/beinComponents/SearchBaseView';
import AdvancedSettingItem from '../../components/AdvancedSettingItem';
import useBaseHook from '~/hooks/baseHook';
import EmptyScreen from '~/components/EmptyScreen';
import images from '~/resources/images';
import useAdvancedNotiSettingsStore from '../store';
import { IGroupNotificationSetting } from '~/interfaces/INotification';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';

interface SearchMemberViewProps {
  isOpen: boolean;
  onClose?: () => void;
  onPressItem: (item: IGroupNotificationSetting) => void;
}

const SearchGroupView = ({
  isOpen,
  onClose,
  onPressItem,
}: SearchMemberViewProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { t } = useBaseHook();
  const [searchText, setSearchText] = useState('');

  const {
    actions,
    searchJoinedGroups,
    isLoadingSearchJoinedGroup,
    hasSearchNextPage,
  } = useAdvancedNotiSettingsStore((state) => state);

  const onLoadMore = () => {
    if (isLoadingSearchJoinedGroup) return;
    if (hasSearchNextPage) {
      actions.searchJoinedGroupFlat({ key: searchText });
    }
  };

  const searchGroups = (searchQuery: string) => {
    actions.clearSearchGroup();
    setSearchText(searchQuery);
    actions.searchJoinedGroupFlat({ key: searchQuery }, true);
  };

  const searchHandler = useCallback(
    debounce(
      searchGroups, appConfig.searchTriggerTime,
    ),
    [],
  );

  const onSearchGroup = (text: string) => {
    searchHandler(text);
  };

  const renderItem = ({ item }: any) => {
    if (!item) return null;
    return (
      <AdvancedSettingItem
        item={item}
        onPress={onPressItem}
      />
    );
  };

  const renderListFooter = () => {
    if (!hasSearchNextPage) {
      return <KeyboardSpacer iosOnly />;
    }
    return (
      <View style={styles.listFooter}>
        <ActivityIndicator testID="search_group.loading_more" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoadingSearchJoinedGroup) return null;
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
      placeholder={t('notification:advanced_notifications_settings:search_group_placeholder')}
      onClose={onClose}
      onChangeText={onSearchGroup}
    >
      <FlatList
        data={searchJoinedGroups}
        scrollEventThrottle={16}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => `advanced_settings.search_group.${item?.id}`}
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

export default SearchGroupView;
