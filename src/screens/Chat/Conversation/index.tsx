import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import i18next from 'i18next';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {GiftedChat} from 'react-native-gifted-chat';
import ImagePicker from 'react-native-image-crop-picker';
import {Modalize} from 'react-native-modalize';
import {useTheme} from 'react-native-paper';
import uuid from 'react-native-uuid';
import {useDispatch} from 'react-redux';
import FlashMessage from '~/beinComponents/FlashMessage';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import appConfig from '~/configs/appConfig';
import {roomTypes} from '~/constants/chat';
import {options} from '~/constants/messageOptions';
import useAuth from '~/hooks/auth';
import useChat from '~/hooks/chat';
import {useRootNavigation} from '~/hooks/navigation';
import {IObject} from '~/interfaces/common';
import {GMessage, IFileResponse, IMessage} from '~/interfaces/IChat';
import {IOption} from '~/interfaces/IOption';
import {RootStackParamList} from '~/interfaces/IRouter';
import images from '~/resources/images';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import actions from '~/screens/Chat/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {getAvatar, validateFile} from '../helper';
import {
  ChatFooter,
  ChatInput,
  MessageContainer,
  MessageOptionsModal,
} from './fragments';

const Conversation = () => {
  const {conversation, messages, mentionResult} = useChat();
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
  const [error, setError] = useState<string | null>(null);
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
  }, [isFocused]);

  useEffect(() => {
    if (route.params?.roomId) {
      dispatch(actions.getConversationDetail(route.params.roomId));
    }
  }, [route.params]);

  useEffect(() => {
    if (conversation?._id) _getMessages();
  }, [conversation._id]);

  const _getMessages = () => {
    dispatch(actions.resetData('messages'));
    dispatch(actions.getData('messages', {roomId: conversation?._id}));
  };

  const loadMoreMessages = () => {
    dispatch(actions.mergeExtraData('messages'));
  };

  const _openImagePicker = () => {
    ImagePicker.openPicker({
      cropping: false,
      mediaType: 'any',
      multiple: false,
      compressVideoPreset: 'Passthrough',
    }).then(result => {
      if (!result) return;

      const file = {
        name: result.filename,
        size: result.size,
        type: result.mime,
        uri: result.path,
      };
      const _error = validateFile(file);
      setError(_error);
      if (_error) return;
      const type = file.type.includes('/') ? file.type.split('/')[0] : 'image';
      showUploadConfirmation(file, type);
    });
  };

  const _openFilePicker = async () => {
    const file = await DocumentPicker.pickSingle();
    const _error = validateFile(file);
    setError(_error);
    if (_error) return;
    showUploadConfirmation(file, 'file');
  };

  const showUploadConfirmation = (file: IFileResponse, type: string) => {
    dispatch(
      modalActions.showAlert({
        title: i18next.t(`chat:label_confirm_send_${type}`),
        content: file.name,
        cancelBtn: true,
        onConfirm: () => uploadFile(file),
        confirmLabel: i18next.t('common:text_send'),
      }),
    );
  };

  const uploadFile = (file: IFileResponse) => {
    const _id = uuid.v4().toString();
    dispatch(
      actions.uploadFile({
        _id,
        localId: _id,
        text: '',
        createdAt: new Date(),
        user,
        _updatedAt: new Date().toISOString(),
        attachment: file,
      }),
    );
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
    const message = messages[0] || {};
    dispatch(
      actions.sendMessage({
        ...message,
        _id: uuid.v4().toString(),
        user,
        _updatedAt: new Date().toISOString(),
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
        avatarProps={{variant: 'default', onError: onLoadAvatarError}}
        title={conversation.name}
        titleTextProps={{numberOfLines: 1, style: styles.headerTitle}}
        icon="search"
        onPressIcon={onSearchPress}
        menuIcon="ConversationInfo"
        onPressMenu={goConversationDetail}
      />
      {!!error && (
        <FlashMessage type="error" onClose={() => setError('')}>
          {error}
        </FlashMessage>
      )}
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
          removeClippedSubviews: true,
          maxToRenderPerBatch: appConfig.recordsPerPage,
          initialNumToRender: appConfig.recordsPerPage,
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
          // <MentionInput
          //   data={mentionResult}
          //   modalStyle={styles.mentionInputModal}
          //   modalPosition={'top'}
          //   isMentionModalVisible={!!content && mentionResult?.length > 0}
          //   onPress={onPressMentionAudience}
          //   onChangeText={onChangeText}
          //   onMentionText={onMentionText}
          //   value={content}
          //   ComponentInput={ChatInput}
          // />
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
        renderChatFooter={() => (
          <ChatFooter
            replyingMessage={replyingMessage}
            onCancel={() => setReplyingMessage(undefined)}
          />
        )}
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
