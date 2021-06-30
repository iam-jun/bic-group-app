import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from 'react-native';
import {TextInput, useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {mainStack} from '~/configs/navigator';
import {useBaseHook} from '~/hooks';
import {IObject} from '~/interfaces/common';
import {IConversation} from '~/store/chat/interfaces';
import Divider from '~/theme/components/Divider';
import Input from '~/theme/components/Input';
import ListView from '~/theme/components/List/ListView';
import ThemeView from '~/theme/components/ThemeView';
import {spacing} from '~/theme/configs';
import {
  generateRandomName,
  generateRandomUser,
  getRandomInt,
} from '~/utils/generation';
import * as actions from '~/store/chat/actions';
import {Header} from '~/theme/components';

const Chat = () => {
  const data: IConversation[] = Array.from(Array(20).keys()).map(index => ({
    name: generateRandomName(),
    members: [generateRandomUser(), generateRandomUser()],
    unreadCount: getRandomInt(0, 10),
    lastMessage: '',
    updatedAt: '2021-06-20T09:00:29.238335Z',
  }));

  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {t, navigation} = useBaseHook();
  const dispatch = useDispatch();

  const onChatPress = (item: IConversation) => {
    dispatch(actions.selectConversation(item));
    navigation.navigate(mainStack.conversation);
  };

  return (
    <ThemeView style={styles.container} testID="ChatScreen" isFullView>
      <Header title="Chat" rightIcon="iconSettings" />

      <Input
        style={styles.inputSearch}
        roundness="big"
        helperType="info"
        placeholder={t('chat:placeholder_search')}
        right={<TextInput.Icon name={'magnify'} />}
      />
      <ListView
        style={styles.listView}
        type="chat"
        data={data}
        onItemPress={onChatPress}
        renderItemSeparator={() => <Divider />}
      />
    </ThemeView>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {},
    inputSearch: {
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.base,
    },
    listView: {
      marginBottom: 70,
    },
  });
};

export default Chat;
