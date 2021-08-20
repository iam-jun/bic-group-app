import i18next from 'i18next';
import {debounce} from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import useChat from '~/hooks/chat';
import {useRootNavigation} from '~/hooks/navigation';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {ITheme} from '~/theme/interfaces';
import MembersSelection from '../fragments/MembersSelection';
import actions from '../redux/actions';

const GroupMembers = (): React.ReactElement => {
  const dispatch = useDispatch();
  const {spacing} = useTheme() as ITheme;
  const {conversation, members, roles} = useChat();
  const {rootNavigation} = useRootNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(actions.getGroupRols());
  }, []);

  useEffect(() => {
    if (roles.data.length > 0) {
      dispatch(actions.resetData('members'));
      dispatch(
        actions.getData(
          'members',
          {
            query: {
              __rooms: {$eq: conversation._id},
              _id: {$nin: roles.data.map((role: any) => role._id)},
            },
          },
          'users',
        ),
      );
    }
  }, [roles]);

  const loadMoreData = () => dispatch(actions.mergeExtraData('members'));

  const onAddPress = () => {
    dispatch(actions.clearSelectedUsers());
    rootNavigation.navigate(chatStack.addMembers);
  };

  const onPressMenu = () => {
    Alert.alert('onMenuPress in development');
  };

  const searchUsers = (searchQuery: string) => {
    dispatch(actions.resetData('members'));
    dispatch(
      actions.getData(
        'members',
        {
          query: {
            $and: [
              {__rooms: {$eq: conversation._id}},
              {_id: {$nin: roles.data.map((role: any) => role._id)}},
              {name: {$regex: searchQuery, $options: 'ig'}},
            ],
          },
        },
        'users',
      ),
    );
  };

  const seachHandler = useCallback(debounce(searchUsers, 1000), []);

  const onQueryChanged = (text: string) => {
    setSearchQuery(text);
    seachHandler(text);
  };

  return (
    <ScreenWrapper testID="GroupMembersScreen" isFullView>
      <Header
        title={i18next.t('chat:title_room_members')}
        menuIcon="addUser"
        onPressMenu={onAddPress}
      />
      <ViewSpacing height={spacing.margin.base} />
      <MembersSelection
        data={members.data}
        title={i18next.t('chat:title_members')}
        roles={searchQuery ? null : roles}
        loading={members.loading}
        searchInputProps={{
          placeholder: i18next.t('chat:placeholder_members_search'),
          onChangeText: onQueryChanged,
        }}
        onPressMenu={onPressMenu}
        onLoadMore={loadMoreData}
      />
    </ScreenWrapper>
  );
};

export default GroupMembers;
