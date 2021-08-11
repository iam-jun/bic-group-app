import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {launchImageLibrary} from 'react-native-image-picker';
import {Modalize} from 'react-native-modalize';
import {useTheme} from 'react-native-paper';
import uuid from 'react-native-uuid';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {roomTypes} from '~/constants/chat';
import {options} from '~/constants/messageOptions';
import useAuth from '~/hooks/auth';
import useChat from '~/hooks/chat';
import {useRootNavigation} from '~/hooks/navigation';
import {IObject} from '~/interfaces/common';
import {GMessage, IMessage} from '~/interfaces/IChat';
import {IOption} from '~/interfaces/IOption';
import {RootStackParamList} from '~/interfaces/IRouter';
import images from '~/resources/images';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import actions from '~/screens/Chat/redux/actions';
import {getAvatar} from '../helper';
import {
  ChatFooter,
  ChatInput,
  MessageContainer,
  MessageOptionsModal,
} from './fragments';

const Conversation = () => {
  const {conversation, messages} = useChat();
  const [selectedMessage, setSelectedMessage] = useState<IMessage>();
  const [replyingMessage, setReplyingMessage] = useState<IMessage>();
  const messageOptionsModalRef = React.useRef<Modalize>();
  const dispatch = useDispatch();
  const {user} = useAuth();
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {rootNavigation} = useRootNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Conversation'>>();
  const [_avatar, setAvatar] = useState<string | string[] | undefined>(
    conversation.avatar,
  );
  const isFocused = useIsFocused();
  const isDirect = conversation.type === roomTypes.DIRECT;

  const onLoadAvatarError = () => {
    if (isDirect) setAvatar(images.img_user_avatar_default);
    else {
      const {usernames} = conversation;
      if (usernames)
        setAvatar(usernames.map((username: string) => getAvatar(username)));
      else setAvatar(images.img_group_avatar_default);
    }
  };

  useEffect(() => {
    !isFocused && dispatch(actions.readSubcriptions(conversation._id));
  }, []);

  useEffect(() => {
    if (route.params?.roomId) {
      dispatch(actions.getConversationDetail(route.params.roomId));
    }
  }, [route.params]);

  useEffect(() => {
    _getMessages();
  }, [conversation._id]);

  const _getMessages = () => {
    dispatch(actions.resetData('messages'));
    dispatch(actions.getData('messages', {roomId: conversation?._id}));
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

  const onSearchPress = async () => {
    alert('Searching is in development');
  };

  const onSend = (messages: GMessage[] = []) => {
    dispatch(
      actions.sendMessage({
        ...messages[0],
        user,
        _updatedAt: new Date().toISOString(),
        localId: uuid.v4().toString(),
      }),
    );

    setReplyingMessage(undefined);
  };

  const onRetry = (message: IMessage) => {
    dispatch(actions.retrySendMessage(message));
  };

  const goConversationDetail = () => {
    rootNavigation.navigate(chatStack.conversationDetail);
  };

  return (
    <ScreenWrapper isFullView testID="MessageScreen">
      <Header
        avatar={_avatar}
        avatarProps={{onError: onLoadAvatarError}}
        title={conversation.name}
        titleTextProps={{numberOfLines: 1, style: styles.headerTitle}}
        icon="search"
        onPressIcon={onSearchPress}
        menuIcon="ConversationInfo"
        onPressMenu={goConversationDetail}
      />

      <GiftedChat
        messages={messages.data}
        onSend={onSend}
        user={{
          _id: 1,
        }}
        scrollToBottom={true}
        keyboardShouldPersistTaps="handled"
        listViewProps={{
          onEndReached: loadMoreMessages,
          onEndReachedThreshold: 0.5,
        }}
        messagesContainerStyle={styles.container}
        onLongPress={showOptions}
        renderTime={() => null}
        renderMessage={props => (
          <MessageContainer
            {...props}
            loading={messages.loading}
            onRetryPress={onRetry}
          />
        )}
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
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingBottom: spacing.padding.large,
    },
    headerTitle: {
      marginEnd: spacing.margin.small,
    },
  });
};

export default Conversation;
