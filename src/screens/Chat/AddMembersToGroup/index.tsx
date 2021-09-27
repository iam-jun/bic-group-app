import i18next from 'i18next';
import {debounce} from 'lodash';
import React, {useCallback, useEffect} from 'react';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {RouteProp, useRoute} from '@react-navigation/core';

import {RootStackParamList} from '~/interfaces/IRouter';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {chatSocketId, roomTypes} from '~/constants/chat';
import useChat from '~/hooks/chat';
import {IChatUser} from '~/interfaces/IChat';
import {sendMessage} from '~/services/chatSocket';
import {ITheme} from '~/theme/interfaces';
import MembersSelection from '../fragments/MembersSelection';
import actions from '../redux/actions';
import * as modalActions from '~/store/modal/actions';
import appConfig from '~/configs/appConfig';

const AddMembersToGroup = (): React.ReactElement => {
  const route = useRoute<RouteProp<RootStackParamList, 'AddMembersToGroup'>>();

  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;

  const dispatch = useDispatch();
  const {selectedUsers, joinableUsers, conversation} = useChat();

  useEffect(() => {
    if (!conversation._id && route?.params?.roomId)
      dispatch(actions.getConversationDetail(route?.params?.roomId));
    dispatch(actions.resetData('joinableUsers'));
    dispatch(
      actions.getData(
        'joinableUsers',
        {
          groupId: route?.params?.roomId,
          limit: appConfig.recordsPerPage,
        },
        'data',
      ),
    );
  }, [route?.params?.roomId]);

  const loadMoreData = () => dispatch(actions.mergeExtraData('joinableUsers'));

  const onAddPress = () => {
    if (conversation.type === roomTypes.GROUP) showConfirmations();
    else doAddUsersToQuickChat();
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
        onConfirm: () => doAddUsersToGroupChat(),
        confirmLabel: i18next.t('chat:button_add_member'),
      }),
    );
  };

  const doAddUsersToGroupChat = () => {
    dispatch(
      actions.addMembersToGroup(
        selectedUsers.map((user: IChatUser) => user.beinUserId),
      ),
    );
  };

  const doAddUsersToQuickChat = () => {
    sendMessage({
      msg: 'method',
      method: 'addUsersToRoom',
      id: chatSocketId.ADD_MEMBERS_TO_GROUP,
      params: [
        {
          rid: route?.params?.roomId,
          users: selectedUsers.map((user: IChatUser) => user.username),
        },
      ],
    });
  };

  const searchUsers = (searchQuery: string) => {
    dispatch(actions.resetData('joinableUsers'));
    dispatch(
      actions.getData(
        'joinableUsers',
        {
          groupId: route?.params?.roomId,
          offset: 0,
          limit: appConfig.recordsPerPage,
          key: searchQuery,
        },
        'data',
      ),
    );
  };

  const seachHandler = useCallback(
    debounce(searchUsers, appConfig.searchTriggerTime),
    [],
  );

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
        loading={joinableUsers.loading}
        data={joinableUsers.data}
        searchInputProps={{
          onChangeText: onQueryChanged,
        }}
        onLoadMore={loadMoreData}
      />
    </ScreenWrapper>
  );
};

export default AddMembersToGroup;
