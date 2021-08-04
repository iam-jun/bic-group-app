import i18next from 'i18next';
import React, {useEffect} from 'react';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {chatSocketId} from '~/constants/chat';
import useChat from '~/hooks/chat';
import {IUser} from '~/interfaces/IAuth';
import {sendMessage} from '~/services/chatSocket';
import {ITheme} from '~/theme/interfaces';
import MembersSelection from '../fragments/MembersSelection';
import actions from '../redux/actions';

const AddMembersToGroup = (): React.ReactElement => {
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;

  const dispatch = useDispatch();
  const {selectedUsers, users, conversation} = useChat();

  useEffect(() => {
    dispatch(
      actions.getData('users', true, {
        __rooms: {$elemMatch: {$ne: conversation._id}},
      }),
    );
  }, []);

  const loadMoreData = () => dispatch(actions.mergeExtraData('users'));

  const onAddPress = () => {
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

  return (
    <ScreenWrapper testID="AddMembersToGroupScreen" isFullView>
      <Header
        title={i18next.t('chat:title_invite_membesr')}
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
        loading={users.loading}
        data={users.data}
        onLoadMore={loadMoreData}
      />
    </ScreenWrapper>
  );
};

export default AddMembersToGroup;
