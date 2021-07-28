import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';

import {IObject} from '~/interfaces/common';
import {Container, Text, ViewSpacing} from '~/components';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {spacing} from '~/theme';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import ListView from '~/beinComponents/list/ListView';
import Header from '~/beinComponents/Header';
import actions from '../redux/actions';
import useChat from '~/hooks/chat';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import {IUser} from '~/interfaces/IAuth';
import Avatar from '~/beinComponents/Avatar';
import {ITheme} from '~/theme/interfaces';
import {sendMessage} from '~/services/chatSocket';
import {CHAT_SOCKET_CREATE_DIRECT_CHAT_ID} from '~/services/constants';

const CreateConversation = (): React.ReactElement => {
  const theme: ITheme = useTheme();
  const styles = createStyles(theme);
  const {colors} = theme;

  const dispatch = useDispatch();
  const {users, selectedUsers} = useChat();

  useEffect(() => {
    dispatch(actions.getUsers());
  }, []);

  const createDirectChat = () => {
    sendMessage({
      msg: 'method',
      method: 'createDirectMessage',
      id: CHAT_SOCKET_CREATE_DIRECT_CHAT_ID,
      params: selectedUsers.map((user: IUser) => user.username),
    });
  };

  const onSelectUser = (user: IUser) => {
    dispatch(actions.selectUser(user));
  };

  const renderItemUser = ({item}: {item: IUser; index: number}) => {
    return (
      <PrimaryItem
        title={item.name || item.username}
        isChecked={item.selected}
        LeftComponent={
          <Avatar.Large style={styles.marginRight} source={item.avatar} />
        }
        onPressCheckbox={() => onSelectUser(item)}
      />
    );
  };

  const renderItemSelectedUser = ({item}: {item: IUser; index: number}) => {
    return (
      <View style={styles.itemSelectedUser}>
        <Avatar.Large
          source={item.avatar}
          actionIcon="iconClose"
          onPressAction={() => onSelectUser(item)}
        />
        <ViewSpacing height={spacing.margin.small} />
        <Text.H6 numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text.H6>
      </View>
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
        onPressButton={createDirectChat}
      />
      <Container isFullView>
        <SearchInput />
        <ViewSpacing height={spacing.margin.base} />
        {selectedUsers.length > 0 && (
          <ListView
            title={'Chosen'}
            data={selectedUsers}
            horizontal
            renderItem={renderItemSelectedUser}
            renderItemSeparator={() => (
              <ViewSpacing width={spacing.margin.base} />
            )}
          />
        )}
        <ViewSpacing height={spacing.margin.base} />
        <ListView title={'All'} data={users} renderItem={renderItemUser} />
      </Container>
    </ScreenWrapper>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {dimension} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    marginRight: {
      marginRight: spacing.margin.base,
    },
    itemSelectedUser: {
      width: dimension?.avatarSizes.large,
    },
  });
};

export default CreateConversation;
