import i18next from 'i18next';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import Icon from '~/beinComponents/Icon';
import TextInput from '~/beinComponents/inputs/TextInput';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import useAuth from '~/hooks/auth';
import {useKeySelector} from '~/hooks/selector';
import {IUserProfile} from '~/interfaces/IAuth';
import {IChatUser} from '~/interfaces/IChat';
import menuKeySelector from '~/screens/Menu/redux/keySelector';
import {ITheme} from '~/theme/interfaces';
import actions from '../../redux/actions';

const ReviewConversation = () => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const dispatch = useDispatch();

  const selectedUsers = useKeySelector('chat.selectedUsers');
  const [text, setText] = useState<string>('');
  const myProfile = useKeySelector(menuKeySelector.myProfile) || {};
  const {user} = useAuth();

  const _onChangeText = (text: string) => {
    setText(text);
  };

  const onCreatePress = () => {
    dispatch(
      actions.createConversation(
        selectedUsers,
        undefined,
        undefined,
        text.trim(),
      ),
    );
  };

  const onRemovePress = (user: IChatUser) => {
    /**
     * ACTION chat/selectUser will remove the user from the list
     * as the field "selected" in the parameter of the user is true
     */
    dispatch(actions.selectUser(user));
  };

  const renderListHeader = () => {
    return (
      <View style={styles.chatMembersHeader}>
        <Text.ButtonBase useI18n>chat:title_room_members</Text.ButtonBase>
      </View>
    );
  };

  const renderItemUser = ({
    item,
  }: {
    item: IChatUser & IUserProfile;
    index: number;
  }) => {
    const isMe = item.username === user.username;

    return (
      <PrimaryItem
        showAvatar
        style={styles.itemContainer}
        title={
          isMe ? `${item.fullname} (${i18next.t('chat:text_me')})` : item.name
        }
        avatar={item.avatar}
        RightComponent={
          isMe ? null : (
            <Icon
              style={styles.iconClose}
              icon={'iconClose'}
              size={14}
              onPress={() => onRemovePress(item)}
            />
          )
        }
      />
    );
  };

  return (
    <ScreenWrapper testID="ReviewConversationScreen" isFullView>
      <Header
        title={i18next.t('chat:title_create_quick_chat')}
        buttonText={i18next.t('common:btn_create')}
        buttonProps={{
          disabled: selectedUsers.length === 0,
          highEmphasis: true,
        }}
        onPressButton={onCreatePress}
      />

      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={_onChangeText}
        placeholder={i18next.t('chat:placeholder_input_group_chat_name')}
        helperContent={i18next.t('chat:text_create_quick_chat_name_note')}
      />
      <ListView
        data={[myProfile, ...selectedUsers]}
        style={styles.listView}
        renderItem={renderItemUser}
        ListHeaderComponent={renderListHeader()}
        isFullView
      />
    </ScreenWrapper>
  );
};

export default ReviewConversation;

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    textInput: {
      margin: spacing.margin.base,
    },
    itemContainer: {
      height: undefined,
      marginHorizontal: spacing.margin.tiny,
    },
    chatMembersHeader: {
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.base,
      marginBottom: spacing.margin.small,
    },
    iconClose: {
      marginRight: spacing.margin.small,
    },
    listView: {
      marginBottom: spacing.margin.base,
    },
  });
};
