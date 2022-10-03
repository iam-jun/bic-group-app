import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { StyleSheet } from 'react-native';
import { IUser } from '~/interfaces/IAuth';
import groupsActions from '~/storeRedux/groups/actions';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import appConfig from '~/configs/appConfig';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import spacing from '~/theme/spacing';
import { useBaseHook } from '~/hooks';
import { SearchInput } from '~/baseComponents/Input';
import SearchResults from './components/SearchResults';
import ChosenPeople from './components/ChosenPeople';

const AddMembersToGroup = (props: any) => {
  const { params } = props.route;
  const { groupId } = params || {};

  const { t } = useBaseHook();
  const styles = createStyles();

  const dispatch = useDispatch();
  const selectedUsers = useKeySelector(groupsKeySelector.selectedUsers);
  const users = useKeySelector(groupsKeySelector.users);
  const { loading, data } = users;

  const [searchText, setSearchText] = useState<string>('');

  useEffect(
    () => () => {
      dispatch(groupsActions.resetJoinableUsers());
      dispatch(groupsActions.clearSelectedUsers());
    },
    [],
  );

  const loadMoreData = () => {
    dispatch(groupsActions.mergeExtraJoinableUsers());
  };

  const onSelectUser = (user: IUser) => {
    dispatch(groupsActions.selectJoinableUsers(user));
  };

  const searchUsers = (searchQuery: string) => {
    setSearchText(searchQuery);
    dispatch(groupsActions.resetJoinableUsers());
    dispatch(groupsActions.getJoinableUsers({ groupId, params: { key: searchQuery } }));
  };

  const searchHandler = useCallback(
    debounce(searchUsers, appConfig.searchTriggerTime),
    [],
  );

  const onQueryChanged = (text: string) => {
    searchHandler(text);
  };

  const onPressAdd = () => {
    dispatch(groupsActions.addMembers({ groupId }));
  };

  return (
    <ScreenWrapper testID="AddMembersToGroupScreen" isFullView>
      <Header
        title={t('groups:title_add_members')}
        buttonText={t('common:text_add')}
        buttonProps={{
          disabled: selectedUsers.length === 0,
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

      <ChosenPeople selectedUsers={selectedUsers} onSelectUser={onSelectUser} />

      {!!searchText.trim() && (
        <SearchResults
          loading={loading}
          data={data}
          selectedUsers={selectedUsers}
          onLoadMore={loadMoreData}
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
