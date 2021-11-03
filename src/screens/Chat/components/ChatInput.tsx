import i18next from 'i18next';
import React, {useEffect, useRef, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import uuid from 'react-native-uuid';
import {useDispatch} from 'react-redux';
import CommentInput, {
  ICommentInputSendParam,
} from '~/beinComponents/inputs/CommentInput';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import Text from '~/beinComponents/Text';
import apiConfig from '~/configs/apiConfig';
import useChat from '~/hooks/chat';
import {useKeySelector} from '~/hooks/selector';
import {IFilePicked} from '~/interfaces/common';
import {IMessage} from '~/interfaces/IChat';
import {getDownloadUrl, mapUsers} from '~/screens/Chat/helper';
import actions from '~/screens/Chat/redux/actions';
import menuKeySelector from '~/screens/Menu/redux/keySelector';
import {makeHttpRequest} from '~/services/httpApiRequest';
import * as modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import {validateFile} from '~/utils/validation';

interface Props {
  replyingMessage?: IMessage;
  editingMessage?: IMessage;
  onCancelEditing: () => void;
  onCancelReplying: () => void;
  onSentAttachment: () => void;
  onSendCallback: () => void;
  onError: (err: any) => void;
}

const ChatInput: React.FC<Props> = ({
  editingMessage,
  replyingMessage,
  onCancelEditing,
  onCancelReplying,
  onSendCallback,
  onSentAttachment,
  onError,
}: Props) => {
  const commentInputRef = useRef<any>();

  const dispatch = useDispatch();
  const [text, setText] = useState(editingMessage?.text || '');
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const user = useKeySelector(menuKeySelector.myProfile);
  const {conversation} = useChat();

  useEffect(() => {
    if (!text) {
      commentInputRef?.current?.setText?.('');
    }
  }, [text]);

  useEffect(() => {
    if (
      !commentInputRef?.current?.isFocused() &&
      (editingMessage || replyingMessage)
    ) {
      commentInputRef?.current?.focus();
    }
  }, [editingMessage, replyingMessage]);

  useEffect(() => {
    commentInputRef?.current?.setText?.(editingMessage?.text || '');
  }, [editingMessage?.text]);

  const _onChangeText = (value: string) => {
    setText(value);
  };

  const onSend = (sendData?: ICommentInputSendParam) => {
    if (!text.trim() && !sendData?.image) {
      return;
    }

    onSendCallback();

    if (!editingMessage) {
      dispatch(
        actions.sendMessage({
          _id: uuid.v4().toString(),
          room_id: conversation._id,
          createdAt: new Date().toISOString(),
          text: text.trim(),
          user,
          replyingMessage,
          image: sendData?.image,
        }),
      );
      onCancelReplying();
    } else {
      dispatch(
        actions.editMessage({
          ...editingMessage,
          text: text.trim(),
        }),
      );
    }
    setTimeout(() => {
      //slowdown for web
      commentInputRef?.current?.clear();
    }, 100);
    setText('');
    onCancelEditing();
  };

  const onPressFile = (file: IFilePicked) => {
    const _error = validateFile(file);
    onError(_error);
    if (_error) return;
    showUploadConfirmation(file, 'file');
  };

  const showUploadConfirmation = (file: IFilePicked, type: string) => {
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

  const uploadFile = (file: IFilePicked) => {
    const _id = uuid.v4().toString();
    dispatch(
      actions.uploadFile({
        _id,
        localId: _id,
        user,
        room_id: conversation._id,
        _updatedAt: new Date().toISOString(),
        attachment: file,
      }),
    );
  };

  const uploadFilePromise = async (param: any) => {
    try {
      const {file, text} = param || {};
      if (!file) {
        return Promise.reject();
      }
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append(
        'description',
        JSON.stringify({size: file.size, type: file.type}),
      );
      if (text) {
        formData.append('msg', text);
      }
      const response: any = await makeHttpRequest(
        apiConfig.Chat.uploadFile(conversation._id, formData),
      );
      if (response?.data?.success) {
        const attachment: any = response?.data?.message?.attachments?.[0];
        const link = getDownloadUrl(attachment?.title_link);
        onSentAttachment?.();
        return Promise.resolve(link);
      } else {
        return Promise.reject(response?.data);
      }
    } catch (e) {
      return Promise.reject();
    }
  };

  const getMentionUsers = async (param: any) => {
    try {
      const {key} = param || {};
      const conversationId = conversation?._id;
      const response: any = await makeHttpRequest(
        apiConfig.Chat.mentionUsers({
          fields: {customFields: 1},
          query: {
            $and: [
              {__rooms: {$eq: conversationId}},
              {name: {$regex: key, $options: 'ig'}},
            ],
          },
        }),
      );
      const users = mapUsers(response?.data?.users || []);
      return Promise.resolve({data: users || []});
    } catch (e) {
      return Promise.reject();
    }
  };

  const onCancel = () => {
    !!editingMessage && onCancelEditing();
    !!replyingMessage && onCancelReplying();
  };

  const renderInputHeader = () => {
    if (!editingMessage && !replyingMessage) return null;
    return (
      <View style={styles.inputMessageHeader}>
        <View style={styles.headerContent}>
          <Text.BodyM>
            {!!editingMessage && i18next.t('chat:text_editing_message')}
            {!!replyingMessage && i18next.t('post:label_replying_to')}
            {!!replyingMessage && (
              <Text.BodyM>
                {replyingMessage.user.name || i18next.t('post:someone')}
              </Text.BodyM>
            )}
            <Text.BodySM color={theme.colors.textSecondary}>
              {'  • '}
              <Text.BodyM
                useI18n
                color={theme.colors.textSecondary}
                onPress={onCancel}>
                common:btn_cancel
              </Text.BodyM>
            </Text.BodySM>
          </Text.BodyM>
        </View>
      </View>
    );
  };

  return (
    <MentionInput
      modalPosition="top"
      onChangeText={_onChangeText}
      ComponentInput={CommentInput}
      mentionField="beinUserId"
      componentInputProps={{
        HeaderComponent: renderInputHeader(),
        commentInputRef: commentInputRef,
        isHandleUpload: true,
        clearWhenUploadDone: true,
        onPressSend: onSend,
        onPressFile,
        uploadFilePromise,
      }}
      showItemAll
      emptyContent={i18next.t('post:mention_empty_content')}
      allReplacer={`@[u:all:${i18next.t('chat:text_mention_all')}] `}
      getDataPromise={getMentionUsers}
      getDataParam={{}}
      getDataResponseKey={'data'}
      fullWidth={Platform.OS !== 'web'}
      showShadow={Platform.OS === 'web'}
    />
  );
};

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    inputMessageHeader: {
      flexDirection: 'row',
      marginHorizontal: spacing?.margin.base,
      marginTop: spacing?.margin.tiny,
    },
    headerContent: {
      flex: 1,
      flexDirection: 'row',
    },
  });
};

export default ChatInput;
