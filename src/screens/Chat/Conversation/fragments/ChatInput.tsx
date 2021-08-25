import i18next from 'i18next';
import {debounce} from 'lodash';
import React, {useState} from 'react';
import {Platform} from 'react-native';
import uuid from 'react-native-uuid';
import {useDispatch} from 'react-redux';
import CommentInput from '~/beinComponents/inputs/CommentInput';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import useAuth from '~/hooks/auth';
import useChat from '~/hooks/chat';
import {IFileResponse} from '~/interfaces/common';
import {IChatUser} from '~/interfaces/IChat';
import actions from '~/screens/Chat/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {validateFile} from '~/utils/validation';

interface Props {
  onError: (err: any) => void;
}

const ChatInput: React.FC<Props> = ({onError}: Props) => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const {user} = useAuth();
  const {conversation, mention} = useChat();
  const {mentionUsers, mentionKey} = mention;

  const _onChangeText = (value: string) => {
    setText(value);
  };

  const onSend = () => {
    dispatch(
      actions.sendMessage({
        _id: uuid.v4().toString(),
        room_id: conversation._id,
        _updatedAt: new Date().toISOString(),
        text,
        user,
      }),
    );
    setText('');
  };

  const onSubmitEditing = () => {
    if (Platform.OS !== 'web') return;
    onSend();
  };

  const onPressSelectImage = (file: IFileResponse) => {
    const _error = validateFile(file);
    onError(_error);
    if (_error) return;
    const type = file.type.includes('/') ? file.type.split('/')[0] : 'image';
    showUploadConfirmation(file, type);
  };

  const onPressFile = (file: IFileResponse) => {
    const _error = validateFile(file);
    onError(_error);
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
        user,
        room_id: conversation._id,
        _updatedAt: new Date().toISOString(),
        attachment: file,
      }),
    );
  };

  const onMentionText = debounce((textMention: string) => {
    if (textMention) {
      dispatch(actions.setMentionSearchKey(textMention));
      dispatch(actions.getMentionUsers(textMention));
    } else if (mentionKey || mentionUsers?.length > 0) {
      dispatch(actions.setMentionUsers([]));
      dispatch(actions.setMentionSearchKey(''));
    }
  });

  const onPressMentionUser = (user: IChatUser) => {
    const mention = `@[u:${user._id}:${user.name}] `;
    const newText = text.replace(`@${mentionKey}`, mention);
    setText(newText);

    dispatch(actions.setMentionUsers([]));
    dispatch(actions.setMentionSearchKey(''));
  };

  const onPressAll = () => {
    const mention = `@[u:all:${i18next.t('chat:text_mention_all')}] `;
    const newText = text.replace(`@${mentionKey}`, mention);
    setText(newText);

    dispatch(actions.setMentionUsers([]));
    dispatch(actions.setMentionSearchKey(''));
  };

  return (
    <MentionInput
      data={mentionUsers}
      modalPosition="top"
      isMentionModalVisible={!!text && mentionUsers?.length > 0}
      onChangeText={_onChangeText}
      onMentionText={onMentionText}
      value={text}
      onPress={onPressMentionUser}
      onPressAll={onPressAll}
      ComponentInput={CommentInput}
      componentInputProps={{
        onPressSend: onSend,
        onSubmitEditing,
        onPressFile,
        onPressSelectImage,
      }}
    />
  );
};

export default ChatInput;
