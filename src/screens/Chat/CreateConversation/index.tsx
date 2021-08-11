import i18next from 'i18next';
import React, {useEffect} from 'react';
import {useTheme} from 'react-native-paper';
import uuid from 'react-native-uuid';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {roomTypes} from '~/constants/chat';
import useAuth from '~/hooks/auth';
import useChat from '~/hooks/chat';
import {IUser} from '~/interfaces/IAuth';
import {ITheme} from '~/theme/interfaces';
import {generateRoomName} from '~/utils/generator';
import MembersSelection from '../fragments/MembersSelection';
import actions from '../redux/actions';

const CreateConversation = (): React.ReactElement => {
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;

  const dispatch = useDispatch();
  const {user} = useAuth();
  const {selectedUsers, users} = useChat();

  useEffect(() => {
    dispatch(actions.resetData('users'));
    dispatch(actions.getData('users'));
  }, []);

  const loadMoreData = () => dispatch(actions.mergeExtraData('users'));

  const onCreatePress = () => {
    const name =
      selectedUsers.length > 1
        ? generateRoomName(
            user,
            selectedUsers.map((user: IUser) => user.name),
          )
        : selectedUsers[0].name;
    const type = selectedUsers.length > 1 ? roomTypes.QUICK : roomTypes.DIRECT;

    dispatch(
      actions.createConversation({
        name,
        members: selectedUsers.map((user: IUser) => user.username),
        customFields: {
          type,
        },
      }),
    );
  };

  return (
    <ScreenWrapper testID="CreateConversationScreen" isFullView>
      <Header
        title={i18next.t('chat:title_add_participants')}
        buttonText={i18next.t('common:btn_create')}
        buttonProps={{
          disabled: selectedUsers.length === 0,
          color: colors.primary7,
          textColor: colors.textReversed,
        }}
        onPressButton={onCreatePress}
      />
      <ViewSpacing height={spacing?.margin.base} />
      <MembersSelection
        selectable
        title={i18next.t('common:text_all')}
        loading={users.loading}
        data={users.data}
        onLoadMore={loadMoreData}
      />
    </ScreenWrapper>
  );
};

export default CreateConversation;
