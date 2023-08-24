import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import appConfig from '~/configs/appConfig';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/baseComponents/ScreenWrapper';
import spacing from '~/theme/spacing';
import { useBaseHook } from '~/hooks';
import { SearchInput } from '~/baseComponents/Input';
import SearchResults from './components/SearchResults';
import ChosenPeople from './components/ChosenPeople';
import useGroupJoinableUsersStore from './store';

const AddMembersToGroup = (props: any) => {
  const { params } = props.route;
  const { groupId } = params || {};

  const { t } = useBaseHook();
  const styles = createStyles();

  const {
    data, selectedUsers, actions, reset,
  } = useGroupJoinableUsersStore((state) => state);

  const [searchText, setSearchText] = useState<string>('');
  const shouldDisableAddBtn = selectedUsers.length === 0;

  useEffect(
    () => () => {
      reset();
    },
    [],
  );

  const getData = (key: string, isLoadMore = false) => {
    actions.getGroupJoinableUsers({ groupId, key, isLoadMore });
  };

  const onLoadMore = () => {
    getData(searchText, true);
  };

  const onSelectUser = (userId: string) => {
    actions.setSelectedUsers(userId);
  };

  const searchUsers = (searchQuery: string) => {
    setSearchText(searchQuery);
    if (!searchQuery.trim()) return;
    getData(searchQuery);
  };

  const searchHandler = useCallback(
    debounce(searchUsers, appConfig.searchTriggerTime),
    [],
  );

  const onQueryChanged = (text: string) => {
    searchHandler(text);
  };

  const onPressAdd = () => {
    actions.addUsersToGroup(groupId);
  };

  return (
    <ScreenWrapper testID="AddMembersToGroupScreen" isFullView>
      <Header
        title={t('groups:title_add_members')}
        buttonText={t('common:text_add')}
        buttonProps={{
          disabled: shouldDisableAddBtn,
        }}
        onPressButton={onPressAdd}
      />

      <SearchInput
        autoFocus
        autoComplete="off"
        style={styles.searchInput}
        onChangeText={onQueryChanged}
        placeholder={t('groups:text_search_member')}
      />

      <ChosenPeople
        data={data}
        selectedUsers={selectedUsers}
        onSelectUser={onSelectUser}
      />

      {!!searchText.trim() && (
        <SearchResults
          data={data}
          selectedUsers={selectedUsers}
          onLoadMore={onLoadMore}
          onSelectUser={onSelectUser}
        />
      )}
    </ScreenWrapper>
  );
};

const createStyles = () => StyleSheet.create({
  searchInput: {
    margin: spacing.margin.large,
  },
});

export default AddMembersToGroup;
