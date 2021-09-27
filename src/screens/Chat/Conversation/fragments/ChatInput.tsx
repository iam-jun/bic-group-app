import i18next from 'i18next';
import React, {useEffect, useState} from 'react';
import uuid from 'react-native-uuid';
import {useDispatch} from 'react-redux';
import CommentInput from '~/beinComponents/inputs/CommentInput';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import apiConfig from '~/configs/apiConfig';
import useAuth from '~/hooks/auth';
import useChat from '~/hooks/chat';
import {IFilePicked} from '~/interfaces/common';
import {IMessage} from '~/interfaces/IChat';
import {mapUsers} from '~/screens/Chat/helper';
import actions from '~/screens/Chat/redux/actions';
import {makeHttpRequest} from '~/services/httpApiRequest';
import * as modalActions from '~/store/modal/actions';
import {validateFile} from '~/utils/validation';

interface Props {
  editingMessage?: IMessage;
  onChangeMessage?: (value: IMessage | undefined) => void;
  onError: (err: any) => void;
}

const ChatInput: React.FC<Props> = ({
  editingMessage,
  onChangeMessage,
  onError,
}: Props) => {
  const dispatch = useDispatch();
  const [text, setText] = useState(editingMessage?.text || '');

  const {user} = useAuth();
  const {conversation} = useChat();

  useEffect(() => {
    setText(editingMessage?.text || '');
  }, [editingMessage?.text]);

  const _onChangeText = (value: string) => {
    setText(value);
  };

  const onSend = () => {
    if (!editingMessage) {
      dispatch(
        actions.sendMessage({
          _id: uuid.v4().toString(),
          room_id: conversation._id,
          _updatedAt: new Date().toISOString(),
          text: text.trim(),
          user,
        }),
      );
    } else {
      dispatch(
        actions.editMessage({
          ...editingMessage,
          text: text.trim(),
        }),
      );
    }
    setText('');
    onChangeMessage?.(undefined);
  };

  const onPressSelectImage = (file: IFilePicked) => {
    const _error = validateFile(file);
    onError(_error);
    if (_error) return;
    const type = file.type.includes('/') ? file.type.split('/')[0] : 'image';
    showUploadConfirmation(file, type);
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

  return (
    <MentionInput
      modalPosition="top"
      onChangeText={_onChangeText}
      value={text}
      ComponentInput={CommentInput}
      mentionField="beinUserId"
      componentInputProps={{
        onPressSend: onSend,
        onPressFile,
        onPressSelectImage,
      }}
      showItemAll
      emptyContent={i18next.t('post:mention_empty_content')}
      allReplacer={`@[u:all:${i18next.t('chat:text_mention_all')}] `}
      getDataPromise={getMentionUsers}
      getDataParam={{}}
      getDataResponseKey={'data'}
    />
  );
};

export default ChatInput;
