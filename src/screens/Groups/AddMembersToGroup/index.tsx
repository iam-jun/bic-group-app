import i18next from 'i18next';
import {debounce} from 'lodash';
import React, {useCallback, useEffect} from 'react';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {IUser} from '~/interfaces/IAuth';
import {ITheme} from '~/theme/interfaces';
import groupsActions from '../redux/actions';
import useGroups from '~/hooks/groups';

import MembersSelection from '~/beinFragments/MembersSelection';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';

const AddMembersToGroup = (): React.ReactElement => {
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;

  const dispatch = useDispatch();
  const {selectedUsers, users} = useGroups();

  useEffect(() => {
    dispatch(groupsActions.resetUser());
    dispatch(groupsActions.getUser());
  }, []);

  const loadMoreData = () => {
    // dispatch(actions.mergeExtraData('users'))
  };

  const onInvitePress = () => {
    alert('Invite people...');
  };

  const searchUsers = (searchQuery: string) => {
    // dispatch(actions.resetData('users'));
  };

  const searchHandler = useCallback(debounce(searchUsers, 1000), []);

  const onQueryChanged = (text: string) => {
    searchHandler(text);
  };

  const _onSelectUser = (user: IUser) => {
    dispatch(groupsActions.selectUser({...user, _id: user.id}));
  };

  return (
    <ScreenWrapper testID="AddMembersToGroupScreen" isFullView>
      <Header
        title={i18next.t('groups:text_invite_members')}
        buttonText={i18next.t('common:text_invite')}
        buttonProps={{
          disabled: selectedUsers.length === 0,
          color: colors.primary7,
          textColor: colors.textReversed,
        }}
        onPressButton={onInvitePress}
      />
      <ViewSpacing height={spacing?.margin.base} />
      <MembersSelection
        selectable
        selectedUsers={selectedUsers}
        title={'common:text_all'}
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
