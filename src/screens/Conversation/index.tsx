import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {GiftedChat, IMessage} from 'react-native-gifted-chat';
import {launchImageLibrary} from 'react-native-image-picker';
import {Modalize} from 'react-native-modalize';
import {useTheme} from 'react-native-paper';
import {options} from '~/constants/messageOptions';
import useAuth from '~/hooks/auth';
import useChat from '~/hooks/chat';
import {IObject} from '~/interfaces/common';
import {IOption} from '~/interfaces/IOption';
import HeaderView from '~/theme/components/Header/HeaderView';
import ThemeView from '~/theme/components/ThemeView';
import ChatFooter from '~/theme/containers/Chat/ChatFooter';
import {ChatInput} from '~/theme/containers/Chat/ChatInput';
import MessageContainer from '~/theme/containers/Chat/MessageContainer';
import MessageOptionsModal from '~/theme/containers/Modal/MessageOptions';
import Header from '~/theme/components/Header';
import {useDispatch} from 'react-redux';
import * as actions from '~/store/chat/actions';
import {useBaseHook} from '~/hooks';
import {mainStack} from '~/configs/navigator';

const Conversation = () => {
  // const [messages, setMessages] = useState<IMessage[]>([]);
  const {user} = useAuth();
  const {conversation, messages} = useChat();
  const [selectedMessage, setSelectedMessage] = useState<IMessage>();
  const [replyingMessage, setReplyingMessage] = useState<IMessage>();
  const messageOptionsModalRef = React.useRef<Modalize>();
  const dispatch = useDispatch();
  const theme: IObject<any> = useTheme();
  const {colors} = theme;
  const styles = createStyles(theme);
  const {navigation} = useBaseHook();

  const _openImagePicker = () => {
    launchImageLibrary(
      {mediaType: 'photo'},
      async ({uri, fileName, type}) => {},
    );
  };

  const _openFilePicker = () => {};

  const showOptions = (message?: IMessage) => {
    console.log('showOptions', {message});

    setSelectedMessage(message);
    messageOptionsModalRef.current?.open();
  };

  const onOptionsClosed = () => {
    setSelectedMessage(undefined);
  };

  const onReactionPress = async (type: string) => {
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

  const onSend = useCallback((messages = []) => {
    dispatch(
      actions.sendMessage({
        ...messages[0],
        quoted_message: replyingMessage,
        user,
      }),
    );
    setReplyingMessage(undefined);
  }, []);

  const goConversationDetail = () => {
    navigation.navigate(mainStack.conversationDetail);
  };

  return (
    <ThemeView isFullView testID="MessageScreen">
      <Header
        isFullView
        isDefault
        title={conversation.name}
        rightIcon="iconOptions"
        rightPress={goConversationDetail}
      />
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        scrollToBottom={true}
        keyboardShouldPersistTaps="handled"
        onLongPress={showOptions}
        renderTime={() => null}
        renderMessage={props => <MessageContainer {...props} />}
        messagesContainerStyle={styles.messagesContainer}
        renderInputToolbar={props => (
          <ChatInput
            {...props}
            onEnterPress={text =>
              props.onSend && props.onSend({text: text.trim()}, true)
            }
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
        modalRef={messageOptionsModalRef}
        onMenuPress={onMenuPress}
        onReactionPress={onReactionPress}
        onClosed={onOptionsClosed}
      />
    </ThemeView>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    messagesContainer: {
      paddingBottom: 24,
    },
  });
};

export default Conversation;
