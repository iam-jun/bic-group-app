import i18next from 'i18next';
import {AppConfig} from '~/configs';
import {roomTypes} from '~/constants/chat';
import {IUser} from '~/interfaces/IAuth';
import {IAttachment, IConversation, IMessage} from '~/interfaces/IChat';
import {getChatAuthInfo} from '~/services/httpApiRequest';
import {getEnv} from '~/utils/env';
import {timestampToISODate} from '~/utils/formatData';
import {generateRoomName} from '~/utils/generator';
import {IFileResponse} from './../../interfaces/IChat';

export const mapData = (user: IUser, dataType: string, data: any) => {
  switch (dataType) {
    case 'users':
    case 'members':
      return mapUsers(data);
    case 'groups':
      return mapConversations(user, data);
    case 'messages':
      return mapMessages(data);
    default:
      return data;
  }
};

export const mapConversations = (user: IUser, data?: []): IConversation[] =>
  (data || []).map((item: any) => mapConversation(user, item));

export const mapMessages = (data?: []): IMessage[] =>
  (data || []).map((item: any) => mapMessage(item));

export const mapUsers = (data?: []): IUser[] =>
  (data || []).map((item: any) => mapUser(item));

export const mapConversation = (user: IUser, item: any): IConversation => {
  const _id = item?._id || item?.rid;
  const {type, usernames, members} = item?.customFields || {};

  const membersExcludeMe = (members || []).filter(
    (member: any) => member?.username !== user?.username,
  );

  const name =
    type === roomTypes.DIRECT
      ? (members || []).length > 0
        ? generateRoomName(
            user,
            membersExcludeMe.map(
              (member: any) => member.name || member.username,
            ),
          )
        : item.fname || item.name
      : item?.fname || item.name;

  const avatar =
    type === roomTypes.DIRECT
      ? getAvatar(membersExcludeMe?.length > 0 && membersExcludeMe[0]?.username)
      : getRoomAvatar(_id);

  const attachment =
    item.lastMessage?.attachments?.length > 0 &&
    item.lastMessage.attachments[0];

  const lastMessage = item.lastMessage
    ? attachment
      ? item.lastMessage.u?.username === user?.username
        ? i18next.t('chat:label_last_message:my_attachment')
        : i18next
            .t('chat:label_last_message:other_attachment')
            .replace('{0}', item.lastMessage.u?.name)
      : `${item.lastMessage.u?.name}: ${item?.lastMessage?.msg}`
    : null;

  return {
    ...item,
    _id,
    name,
    usernames,
    type: item.customFields?.type,
    avatar,
    user: mapUser(item?.u),
    directUser: membersExcludeMe?.length > 0 && membersExcludeMe[0],
    lastMessage,
    _updatedAt: timestampToISODate(item._updatedAt),
  };
};

export const mapMessage = (item: any): IMessage => {
  const user = mapUser(item?.u);
  let attachment = null;
  if (item.attachments?.length > 0) {
    const _attachment: IAttachment = item.attachments[0];
    const extraData = JSON.parse(_attachment.description || '{}');
    attachment = {
      ..._attachment,
      name: _attachment.title,
      ...extraData,
    };
  }
  const type = item.type || attachment?.type;

  return {
    ...item,
    room_id: item?.rid,
    user,
    type,
    system: !!item.t,
    createdAt: timestampToISODate(item.ts),
    _updatedAt: timestampToISODate(item._updatedAt),
    status: 'sent',
    text: item.t
      ? i18next
          .t(`chat:system_message_${item.t}`)
          .replace('{0}', user.name || '')
          .replace('{1}', item.msg)
      : item?.msg,
    attachment,
    localId: item.localId || attachment?.localId,
  };
};

export const mapUser = (item: any): IUser => ({
  ...item,
  avatar: getAvatar(item.username),
  name: item?.name || item?.fullname || item?.username,
});

export const mapRole = (item: any) => ({
  ...item,
  ...mapUser(item.u),
});

export const getAvatar = (username: string) =>
  `${getEnv('ROCKET_CHAT_SERVER')}avatar/${username}`;

export const getRoomAvatar = (roomId: string) =>
  `${getEnv('ROCKET_CHAT_SERVER')}avatar/room/${roomId}`;

export const getMessageAttachmentUrl = (attachmentUrl: string) => {
  const auth = getChatAuthInfo();

  if (attachmentUrl.startsWith('http')) {
    if (attachmentUrl.includes('rc_token')) {
      return encodeURI(attachmentUrl);
    }
    return encodeURI(
      `${attachmentUrl}?rc_uid=${auth.userId}&rc_token=${auth.accessToken}`,
    );
  }
  return encodeURI(
    `${getEnv('ROCKET_CHAT_SERVER')}${attachmentUrl}?rc_uid=${
      auth.userId
    }&rc_token=${auth.accessToken}`,
  );
};

export const validateFile = (file: IFileResponse): string | null => {
  if (file.size > AppConfig.maxFileSize) {
    return i18next.t('chat:error:file:over_file_size');
  }
  return null;
};
