import i18next from 'i18next';
import {debounce} from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {IUser} from '~/interfaces/IAuth';
import {ITheme} from '~/theme/interfaces';
import groupsActions from '../redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import appConfig from '~/configs/appConfig';

import MembersSelection from '~/beinFragments/MembersSelection';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';

const AddMembersToGroup = (): React.ReactElement => {
  const theme: ITheme = useTheme() as ITheme;
  const {spacing} = theme;
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const selectedUsers = useKeySelector(groupsKeySelector.selectedUsers);
  const users = useKeySelector(groupsKeySelector.users);
  const group = useKeySelector(groupsKeySelector.groupDetail.group);
  const {id: groupId} = group;

  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    dispatch(groupsActions.resetJoinableUsers());
    dispatch(groupsActions.getJoinableUsers({groupId}));
  }, []);

  const loadMoreData = () => {
    dispatch(groupsActions.mergeExtraJoinableUsers());
  };

  const _onSelectUser = (user: IUser) => {
    dispatch(groupsActions.selectJoinableUsers(user));
  };

  const searchUsers = (searchQuery: string) => {
    setSearchText(searchQuery);
    dispatch(groupsActions.resetJoinableUsers());
    dispatch(
      groupsActions.getJoinableUsers({groupId, params: {key: searchQuery}}),
    );
  };

  const searchHandler = useCallback(
    debounce(searchUsers, appConfig.searchTriggerTime),
    [],
  );

  const onQueryChanged = (text: string) => {
    searchHandler(text);
  };

  const onInvitePress = () => {
    doAddUsers();
  };

  const doAddUsers = () => {
    const userIds = selectedUsers.map((user: IUser) => user.id);
    dispatch(groupsActions.addMembers({groupId, userIds}));
    navigation.goBack();
  };

  return (
    <ScreenWrapper testID="AddMembersToGroupScreen" isFullView>
      <Header
        title={i18next.t('groups:text_invite_members')}
        buttonText={i18next.t('common:text_invite')}
        buttonProps={{
          disabled: selectedUsers.length === 0,
          highEmphasis: true,
        }}
        onPressButton={onInvitePress}
      />
      <ViewSpacing height={spacing?.margin.base} />
      <MembersSelection
        selectable
        selectedUsers={selectedUsers}
        title={!searchText ? 'common:text_all' : 'common:text_search_results'}
        loading={users.loading}
        data={users.data}
        searchInputProps={{
          onChangeText: onQueryChanged,
          placeholder: i18next.t('groups:text_search'),
        }}
        onLoadMore={loadMoreData}
        onSelectUser={_onSelectUser}
      />
    </ScreenWrapper>
  );
};

export default AddMembersToGroup;
