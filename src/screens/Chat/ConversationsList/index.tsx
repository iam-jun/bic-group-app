import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {TextInput, useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import {NavigationHeader} from '~/components';
import Divider from '~/components/Divider';
import Input from '~/components/inputs';
import {useBaseHook} from '~/hooks';
import {IObject} from '~/interfaces/common';
import {IConversation} from '~/interfaces/IChat';

import {spacing} from '~/theme';
import actions from '~/screens/Chat/redux/actions';
import {useRootNavigation} from '~/hooks/navigation';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {addOnMessageCallback, sendMessage} from '~/services/chatSocket';
import useChat from '~/hooks/chat';
import appConfig from '~/configs/appConfig';

const ConversationsList = (): React.ReactElement => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();

  const dispatch = useDispatch();
  const {conversations} = useChat();
  const {data, loading} = conversations;

  useEffect(() => {
    const removeOnMessageCallback = addOnMessageCallback(
      'callback-of-list-chat-screen',
      event => {
        dispatch(actions.handleConversationsEvent(JSON.parse(event.data)));
      },
    );

    _getConversations();

    return () => {
      removeOnMessageCallback();
    };
  }, []);

  const _getConversations = () => {
    dispatch(actions.setConversationLoading(true));
    sendMessage({
      msg: 'method',
      method: 'rooms/get',
      id: appConfig.chatSocketUniqueId,
      // params: [{$date: 1480377601}],
    });
  };

  const onChatPress = (item: IConversation) => {
    dispatch(actions.selectConversation(item));
    rootNavigation.navigate(chatStack.conversation, {id: item.id});
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
        loading={loading}
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
