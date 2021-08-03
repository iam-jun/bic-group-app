import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {launchImageLibrary} from 'react-native-image-picker';
import {Modalize} from 'react-native-modalize';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {chatSocketId} from '~/constants/chat';
import {options} from '~/constants/messageOptions';
import useAuth from '~/hooks/auth';
import useChat from '~/hooks/chat';
import {useRootNavigation} from '~/hooks/navigation';
import {IObject} from '~/interfaces/common';
import {GMessage, IMessage} from '~/interfaces/IChat';
import {IOption} from '~/interfaces/IOption';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import actions from '~/screens/Chat/redux/actions';
import {sendMessage} from '~/services/chatSocket';
import {
  ChatFooter,
  ChatInput,
  LoadingMessage,
  MessageContainer,
  MessageOptionsModal,
} from './fragments';

const Conversation = () => {
  const {user} = useAuth();
  const {conversation, messages} = useChat();
  const [selectedMessage, setSelectedMessage] = useState<IMessage>();
  const [replyingMessage, setReplyingMessage] = useState<IMessage>();
  const messageOptionsModalRef = React.useRef<Modalize>();
  const dispatch = useDispatch();
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {rootNavigation} = useRootNavigation();

  useEffect(() => {
    if (messages.canLoadMore) {
      _getMessages();
    }
  }, [conversation, messages.lastDate]);

  const _getMessages = () => {
    dispatch(actions.getData('messages', {roomId: conversation._id}));
  };

  const loadMoreMessages = () => {
    dispatch(actions.mergeExtraData('messages'));
  };

  const _openImagePicker = () => {
    launchImageLibrary({mediaType: 'photo'}, async ({uri, fileName, type}) => {
      console.log({uri, fileName, type});
    });
  };

  const _openFilePicker = () => {
    console.log('_openFilePicker');
  };

  const showOptions = (message?: IMessage) => {
    console.log('showOptions', {message});

    setSelectedMessage(message);
    messageOptionsModalRef.current?.open();
  };

  const onOptionsClosed = () => {
    setSelectedMessage(undefined);
  };

  const onReactionPress = async (type: string) => {
    dispatch(actions.reactMessage(selectedMessage, type));

    messageOptionsModalRef.current?.close();
  };

  const onMenuPress = async (menu: IOption) => {
    switch (menu.type) {
      case options.REPLY:
        setReplyingMessage(selectedMessage);
        break;
    }
    messageOptionsModalRef.current?.close();
  };

  const onSend = (messages: GMessage[] = []) => {
    sendMessage({
      msg: 'method',
      method: 'sendMessage',
      id: chatSocketId.SEND_MESSAGE,
      params: [
        {
          rid: conversation._id,
          msg: messages[0].text,
        },
      ],
    });
    dispatch(
      actions.sendMessage({
        ...messages[0],
        user,
      }),
    );
    setReplyingMessage(undefined);
  };

  const goConversationDetail = () => {
    rootNavigation.navigate(chatStack.conversationDetail);
  };

  return (
    <ScreenWrapper isFullView testID="MessageScreen">
      <Header title={conversation.name} onPressMenu={goConversationDetail} />

      <GiftedChat
        messages={messages.data}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        scrollToBottom={true}
        keyboardShouldPersistTaps="handled"
        listViewProps={{
          onEndReached: loadMoreMessages,
          onEndReachedThreshold: 0.5,
        }}
        onLongPress={showOptions}
        renderTime={() => null}
        renderMessage={props =>
          messages.loading ? (
            <LoadingMessage />
          ) : (
            <MessageContainer {...props} />
          )
        }
        renderInputToolbar={props => (
          <ChatInput
            {...props}
            /*
                InputToolbar has this props but
                GiftedChat have not been define it on InputToolbarProps
              */
            // @ts-ignore
            // eslint-disable-next-line react/prop-types
            onEnterPress={text => props.onSend({text: text.trim()}, true)}
            openImagePicker={_openImagePicker}
            openFilePicker={_openFilePicker}
          />
        )}
        renderChatFooter={() => {
          return (
            <ChatFooter
              replyingMessage={replyingMessage}
              onCancel={() => setReplyingMessage(undefined)}
            />
          );
        }}
      />
      <MessageOptionsModal
        ref={messageOptionsModalRef}
        onMenuPress={onMenuPress}
        onReactionPress={onReactionPress}
        onClosed={onOptionsClosed}
      />
    </ScreenWrapper>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
  });
};

export default Conversation;
