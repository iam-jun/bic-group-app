import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {launchImageLibrary} from 'react-native-image-picker';
import {Modalize} from 'react-native-modalize';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {
  LoadingMessages,
  MessageContainer,
  ChatInput,
  ChatFooter,
  MessageOptionsModal,
} from './fragments';
import NavigationHeader from '~/components/headers/NavigationHeader';
import ScreenWrapper from '~/components/ScreenWrapper';
import {mainStack} from '~/router/navigator/MainStack/stack';
import {options} from '~/constants/messageOptions';
import {useBaseHook} from '~/hooks';
import useAuth from '~/hooks/auth';
import useChat from '~/hooks/chat';
import {IObject} from '~/interfaces/common';
import {GMessage, IMessage} from '~/interfaces/IChat';
import {IOption} from '~/interfaces/IOption';
import * as actions from '~/screens/Chat/redux/actions';

const Conversation = () => {
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
    dispatch(
      actions.sendMessage({
        ...messages[0],
        id: messages[0]._id,
        quoted_message: replyingMessage,
        user,
      }),
    );
    setReplyingMessage(undefined);
  };

  const goConversationDetail = () => {
    navigation.navigate(mainStack.conversationDetail);
  };

  return (
    <ScreenWrapper isFullView testID="MessageScreen">
      <NavigationHeader
        isFullView
        isDefault
        title={conversation.name}
        rightIcon="iconOptions"
        rightPress={goConversationDetail}
      />
      {messages.loading ? (
        <LoadingMessages />
      ) : (
        <GiftedChat
          messages={messages.data}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
          }}
          scrollToBottom={true}
          keyboardShouldPersistTaps="handled"
          onLongPress={showOptions}
          renderTime={() => null}
          renderMessage={props => <MessageContainer {...props} />}
          renderInputToolbar={props => (
            <ChatInput
              {...props}
              /* 
                InputToolbar has this props but 
                GiftedChat have not been define it on InputToolbarProps
              */
              // @ts-ignore
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
      )}
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
