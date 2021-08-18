import i18next from 'i18next';
import {debounce} from 'lodash';
import React, {useCallback, useEffect} from 'react';
import {useTheme} from 'react-native-paper';
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
    dispatch(
      actions.getData('users', {
        query: {username: {$ne: user.username}},
      }),
    );
  }, []);

  const loadMoreData = () => dispatch(actions.mergeExtraData('users'));

  const onCreatePress = () => {
    const name = generateRoomName(
      user,
      selectedUsers.map((user: IUser) => user.name),
    );

    const type = selectedUsers.length > 1 ? roomTypes.QUICK : roomTypes.DIRECT;

    const members = [...selectedUsers, user];

    dispatch(
      actions.createConversation({
        name,
        members: selectedUsers.map((user: IUser) => user.username),
        customFields: {
          type,
          usernames: members.map((user: IUser) => user.username),
          members,
        },
      }),
    );
  };

  const searchUsers = (searchQuery: string) => {
    dispatch(actions.resetData('users'));
    dispatch(
      actions.getData('users', {
        query: {
          $and: [
            {
              username: {$ne: user.username},
            },
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
        searchInputProps={{
          onChangeText: onQueryChanged,
        }}
        onLoadMore={loadMoreData}
      />
    </ScreenWrapper>
  );
};

export default CreateConversation;
