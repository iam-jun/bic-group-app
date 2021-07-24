import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {TextInput, useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {NavigationHeader} from '~/components';
import {mainStack} from '~/configs/navigator';
import {useBaseHook} from '~/hooks';
import useSocketChat from '~/hooks/socketChat';
import {IObject} from '~/interfaces/common';
import {IConversation} from '~/interfaces/IChat';
import Divider from '~/components/Divider';
import Input from '~/components/inputs';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {spacing} from '~/theme';
import {
  generateRandomName,
  generateRandomUser,
  getRandomInt,
} from '~/utils/generator';
import * as actions from '~/screens/Chat/redux/actions';

const ConversationsList = () => {
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

  const sendMessage = useSocketChat({
    onMessage: event => {
      console.log(
        'do something on message type, data must be parsed!',
        JSON.parse(event.data),
      );
    },
  });

  sendMessage('test-message');

  const onChatPress = (item: IConversation) => {
    sendMessage('test-message');
    // dispatch(actions.selectConversation(item));
    // navigation.navigate(mainStack.conversation);
  };

  return (
    <ScreenWrapper style={styles.container} testID="ChatScreen" isFullView>
      <NavigationHeader title="Chat" rightIcon="iconSettings" />
      <Input
        style={styles.inputSearch}
        roundness="big"
        helperType="info"
        placeholder={t('chat:placeholder_search')}
        right={<TextInput.Icon name={'magnify'} />}
      />
      <ListView
        type="chat"
        isFullView
        data={data}
        onItemPress={onChatPress}
        renderItemSeparator={() => <Divider />}
      />
    </ScreenWrapper>
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
  });
};

export default ConversationsList;
