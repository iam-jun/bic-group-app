import debounce from 'lodash/debounce';
import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useBaseHook } from '~/hooks';
import spacing, { padding } from '~/theme/spacing';
import SelectingListInfo from '~/components/SelectingListInfo';
import { SearchInput } from '~/baseComponents/Input';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import Divider from '~/beinComponents/Divider';
import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import useSearchFilterUsersStore from '../store';
import useMounted from '~/hooks/mounted';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import UserItem from './UserItem';
import { ISearchUser } from '~/interfaces/ISearch';
import useCommonController from '~/screens/store';

const SelectUsers = () => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const [isShowYou, setIsShowYou] = useState(true);

  const userProfileData = useCommonController((state) => state.myProfile) || {};

  const searchFilterUsersActions = useSearchFilterUsersStore((state) => state.actions);
  const resetStore = useSearchFilterUsersStore((state) => state.reset);

  const selectedUsers = useSearchFilterUsersStore((state) => state.selected);
  const search = useSearchFilterUsersStore((state) => state.search);
  const {
    items, loading, hasNextPage, key: searchKey,
  } = search;

  useMounted(() => {
    getData(searchKey, true);
  });

  const getData = (key: string, isRefresh: boolean) => {
    searchFilterUsersActions.searchUsers(key, isRefresh);
  };

  useEffect(
    () => () => {
      resetStore();
    },
    [],
  );

  const onSearch = debounce((searchText: string) => {
    getData(searchText, true);
    const query = searchText.trim();
    if (query.length > 0) {
      setIsShowYou(false);
    }
    if (query.length === 0) {
      setIsShowYou(true);
    }
  }, 250);

  const onChangeTextSearch = (text: string) => {
    onSearch(text);
  };

  const onLoadMore = () => {
    if (hasNextPage) {
      getData(searchKey, false);
    }
  };

  const renderListEmptyComponent
    = () => (loading || hasNextPage ? null : <NoSearchResultsFound />);

  const renderListHeaderComponent = () => (
    <>
      <ViewSpacing height={padding.small} />
      {isShowYou && renderItem({ item: userProfileData })}
    </>
  );

  const renderListFooterComponent = () => (
    <View style={styles.footer}>
      {loading && (
        <LoadingIndicator size="large" color={theme.colors.neutral5} />
      )}
    </View>
  );

  const onAddUser = (user: ISearchUser) => {
    const newSelectedUsers = [...selectedUsers, user];
    searchFilterUsersActions.updateSelectedUsers(newSelectedUsers);
  };

  const onRemoveUser = (user: ISearchUser) => {
    const newSelectedUsers = selectedUsers.filter(
      (selectedUser) => selectedUser.id !== user.id,
    );
    searchFilterUsersActions.updateSelectedUsers(newSelectedUsers);
  };

  const renderItem = ({ item }) => {
    const isChecked = selectedUsers.some((selected) => selected.id === item.id);
    return (
      <UserItem
        data={item}
        isChecked={isChecked}
        onAddItem={onAddUser}
        onRemoveItem={onRemoveUser}
        testIDCheckbox={`select_users.user_item_checkbox_${item.id}`}
      />
    );
  };

  const keyExtractor = (item) => `user_item_${item.id}`;

  return (
    <View style={styles.container}>
      <SearchInput
        size="large"
        style={styles.searchInput}
        placeholder={t('search:search_creator_placeholder')}
        onChangeText={onChangeTextSearch}
      />
      <SelectingListInfo
        data={selectedUsers}
        type="tags"
        title={t('search:chosen_people', { number: selectedUsers.length })}
        isShowTitle={!!selectedUsers.length}
        tagProps={(user: ISearchUser) => ({
          type: 'neutral',
          textProps: {
            numberOfLines: 1,
            style: styles.tagTextStyle,
          },
          label: user.fullname,
          avatar: { uri: user.avatar },
        })}
        onRemoveItem={onRemoveUser}
      />
      <Divider />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderListHeaderComponent}
        ListFooterComponent={renderListFooterComponent}
        ListEmptyComponent={renderListEmptyComponent}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.4}
        keyboardShouldPersistTaps="handled"
      />
      <KeyboardSpacer iosOnly />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
    searchInput: {
      margin: spacing?.margin.large,
    },
    list: {
      paddingHorizontal: padding.large,
    },
    footer: {
      marginTop: spacing.margin.extraLarge,
      marginBottom: spacing.margin.big,
    },
    tagTextStyle: {
      color: colors.neutral60,
      flexShrink: 1,
      paddingLeft: spacing.margin.tiny,
    },
  });
};

export default SelectUsers;
