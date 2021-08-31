import i18next from 'i18next';
import {debounce} from 'lodash';
import React, {useCallback, useEffect} from 'react';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {chatSocketId, roomTypes} from '~/constants/chat';
import useChat from '~/hooks/chat';
import {IUser} from '~/interfaces/IAuth';
import {sendMessage} from '~/services/chatSocket';
import {ITheme} from '~/theme/interfaces';
import MembersSelection from '../fragments/MembersSelection';
import actions from '../redux/actions';
import * as modalActions from '~/store/modal/actions';
import {IChatUser} from '~/interfaces/IChat';

const AddMembersToGroup = (): React.ReactElement => {
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;

  const dispatch = useDispatch();
  const {selectedUsers, users, conversation} = useChat();

  useEffect(() => {
    dispatch(actions.resetData('users'));
    dispatch(
      actions.getData('users', {
        fields: {customFields: 1},
        query: {__rooms: {$nin: [conversation._id]}},
      }),
    );
  }, []);

  const loadMoreData = () => dispatch(actions.mergeExtraData('users'));

  const onAddPress = () => {
    if (conversation.type === roomTypes.GROUP) showConfirmations();
    else doAddUser();
  };

  const showConfirmations = () => {
    const type = selectedUsers.length === 1 ? '1' : 'many';

    dispatch(
      modalActions.showAlert({
        iconName: 'addUser',
        title: i18next.t('chat:title_modal_confirm_add_member'),
        content: i18next
          .t(`chat:title_group_add_member:${type}`)
          .replace('{0}', conversation.name),
        cancelBtn: true,
        onConfirm: () => doAddUsersToGroup(),
        confirmLabel: i18next.t('chat:button_add_member'),
      }),
    );
  };

  const doAddUsersToGroup = () => {
    dispatch(
      actions.addUsersToGroup({
        groupId: conversation.beinGroupId,
        userIds: selectedUsers.map((user: IChatUser) => user.beinUserId),
      }),
    );
  };

  const doAddUser = () => {
    sendMessage({
      msg: 'method',
      method: 'addUsersToRoom',
      id: chatSocketId.ADD_MEMBERS_TO_GROUP,
      params: [
        {
          rid: conversation._id,
          users: selectedUsers.map((user: IUser) => user.username),
        },
      ],
    });
  };

  const searchUsers = (searchQuery: string) => {
    dispatch(actions.resetData('users'));
    dispatch(
      actions.getData('users', {
        query: {
          $and: [
            {__rooms: {$nin: [conversation._id]}},
            {name: {$regex: searchQuery, $options: 'ig'}},
          ],
        },
      }),
    );
  };

  const seachHandler = useCallback(debounce(searchUsers, 1000), []);

  const onQueryChanged = (text: string) => {
    seachHandler(text);
  };

  return (
    <ScreenWrapper testID="AddMembersToGroupScreen" isFullView>
      <Header
        title={i18next.t('chat:title_invite_members')}
        buttonText={i18next.t('common:text_add')}
        buttonProps={{
          disabled: selectedUsers.length === 0,
          color: colors.primary7,
          textColor: colors.textReversed,
        }}
        onPressButton={onAddPress}
      />
      <ViewSpacing height={spacing?.margin.base} />
      <MembersSelection
        selectable
        title={'common:text_all'}
        loading={users.loading}
        data={users.data}
        searchInputProps={{
          onChangeText: onQueryChanged,
        }}
        onLoadMore={loadMoreData}
      />
    </ScreenWrapper>
  );
};

export default AddMembersToGroup;
