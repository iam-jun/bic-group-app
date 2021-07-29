import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {TextInput, useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
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
import {CHAT_SOCKET_GET_CONVERSIONS_ID} from '~/services/constants';
import Header from '~/beinComponents/Header';
import i18next from 'i18next';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Avatar from '~/beinComponents/Avatar';
import {View} from 'react-native';
import {Text} from '~/components';
import {formatDate} from '~/utils/formatData';

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
        dispatch(actions.handleEvent(JSON.parse(event.data)));
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
      id: CHAT_SOCKET_GET_CONVERSIONS_ID,
      // params: [{$date: 1480377601}],
    });
  };

  const renderItem = ({item}: {item: IConversation; index: number}) => {
    return (
      <PrimaryItem
        title={item.name}
        subTitle={item.lastMessage}
        onPress={() => onChatPress(item)}
        LeftComponent={
          <Avatar.Large style={styles.marginRight} source={item.avatar} />
        }
        RightComponent={
          <View>
            <Text.H6 color={theme.colors.textSecondary}>
              {formatDate(item._updatedAt)}
            </Text.H6>
          </View>
        }
      />
    );
  };

  const onChatPress = (item: IConversation) => {
    dispatch(actions.selectConversation(item));
    rootNavigation.navigate(chatStack.conversation, {id: item._id});
  };

  const onMenuPress = async () => {
    rootNavigation.navigate(chatStack.createConversation);
  };

  return (
    <ScreenWrapper style={styles.container} testID="ChatScreen" isFullView>
      <Header
        title={i18next.t('chat:title')}
        hideBack
        menuIcon="iconCreateChat"
        onPressMenu={onMenuPress}
      />
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
        renderItem={renderItem}
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
    marginRight: {
      marginRight: spacing.margin.base,
    },
    item: {
      flex: 1,
      flexDirection: 'row',
    },
  });
};

export default ConversationsList;
