import i18next from 'i18next';
import {messageEventTypes, roomTypes} from '~/constants/chat';
import {
  IAttachment,
  IChatUser,
  IConversation,
  IMessage,
} from '~/interfaces/IChat';
import {IOwnReaction, IReactionCounts} from '~/interfaces/IPost';
import {getChatAuthInfo} from '~/services/httpApiRequest';
import {getEnv} from '~/utils/env';
import {timestampToISODate} from '~/utils/formatData';
import {messageStatus} from './../../constants/chat';

export const mapData = (user: IChatUser, dataType: string, data: any) => {
  switch (dataType) {
    case 'users':
    case 'members':
      return mapUsers(data);
    case 'rooms':
      return mapConversations(user, data);
    case 'messages':
      return mapMessages(user, data);
    case 'joinableUsers':
      return mapJoinableUsers(data);
    default:
      return data;
  }
};

export const mapConversations = (user: IChatUser, data?: []): IConversation[] =>
  (data || []).map((item: any) => mapConversation(user, item));

export const mapMessages = (user: IChatUser, data?: []): IMessage[] =>
  (data || []).map((item: any) => mapMessage(user, item));

export const mapUsers = (data?: []): IChatUser[] =>
  (data || []).map((item: any) => mapUser(item));

export const mapJoinableUsers = (data?: []): IChatUser[] =>
  (data || []).map((item: any) => mapJoinableUser(item));

export const mapConversation = (user: IChatUser, item: any): IConversation => {
  if (!item) return item;
  const _id = item.rid || item._id;
  const type = item.t === 'd' ? roomTypes.DIRECT : item.customFields?.type;

  const membersExcludeMe = (item.usernames || []).filter(
    (_username: any) => _username !== user?.username,
  );

  const avatar =
    type === roomTypes.DIRECT
      ? getAvatar(membersExcludeMe?.length > 0 && membersExcludeMe[0])
      : getRoomAvatar(_id);

  const attachment =
    item.lastMessage?.attachments?.length > 0 &&
    item.lastMessage.attachments[0];
  let extraData = null;
  try {
    extraData = JSON.parse(attachment.description || '{}');
  } catch (e: any) {
    console.log(e);
  }
  const lastMessage = item.lastMessage
    ? attachment && extraData?.type !== 'reply'
      ? item.lastMessage.u?.username === user?.username
        ? i18next.t('chat:label_last_message:my_attachment')
        : i18next
            .t('chat:label_last_message:other_attachment')
            .replace('{0}', item.lastMessage.u?.name)
      : `${item.lastMessage.u?.name}: ${item?.lastMessage?.msg}`
    : null;

  return {
    ...item,
    ...item.customFields,
    _id,
    name,
    type,
    avatar,
    user: item.u && mapUser(item?.u),
    directUser: item.t === 'd' && {
      beinUserId: item.bein_user_id,
    },
    lastMessage,
    _updatedAt: timestampToISODate(item._updatedAt),
    unreadCount: 0,
  };
};

export const mapMessage = (_user: IChatUser, item: any): IMessage => {
  const user = mapUser(item?.u);
  let attachment = null;
  let quotedMessage = null;
  if (item.attachments?.length > 0) {
    const _attachment: IAttachment = item.attachments[0];
    let extraData = null;
    try {
      extraData = JSON.parse(_attachment.description || '{}');
    } catch (e: any) {
      console.log(e);
    }
    if (extraData?.type === 'reply') {
      quotedMessage = extraData;
    } else {
      attachment = {
        ..._attachment,
        name: _attachment.title,
        ...extraData,
      };
    }
  }
  const type = item.t || attachment?.type;
  let text = item.msg;
  const isMyMessage = user.username === _user.username;

  if (item.t) {
    if (item.t === messageEventTypes.REMOVE_MESSAGE) {
      text = i18next.t(
        `chat:system_message:${item.t}:${isMyMessage ? 'me' : 'other'}`,
      );
    } else {
      text = i18next.t(`chat:system_message:${item.t}`);
    }
  }

  let reaction_counts: IReactionCounts = {};
  let own_reactions: IOwnReaction = {};
  if (item?.reactions) {
    Object.keys(item?.reactions).map(emoji => {
      const emojiName = emoji.replace(/:/g, '');
      const count = item.reactions[emoji].usernames.length;
      if (item.reactions[emoji].usernames.includes(_user.username)) {
        own_reactions = {...own_reactions, [emojiName]: [{id: emojiName}]};
      }
      reaction_counts = {...reaction_counts, [emojiName]: count};
    });
  }

  return {
    ...item,
    room_id: item?.rid,
    user,
    type,
    system: !!item.t && item.t !== messageEventTypes.REMOVE_MESSAGE,
    removed: !!item.t && item.t === messageEventTypes.REMOVE_MESSAGE,
    createdAt: timestampToISODate(item.ts?.$date),
    _updatedAt: timestampToISODate(item._updatedAt),
    status: messageStatus.SENT,
    text,
    attachment,
    quotedMessage,
    localId: item.localId || attachment?.localId,
    reaction_counts,
    own_reactions,
  };
};

export const mapUser = (item: any): IChatUser => ({
  ...item,
  ...item.customFields,
  avatar: getAvatar(item?.username),
  name: item?.name || item?.fullname || item?.username,
});

export const mapJoinableUser = (item: any): IChatUser => ({
  ...item,
  _id: item.rocket_chat_id,
  beinUserId: item.id,
  avatar: getAvatar(item?.username),
  name: item?.name || item?.fullname || item?.username,
  ...item?.customFields,
});

export const mapRole = (item: any) => ({
  ...item,
  ...mapUser(item.u),
});

export const getAvatar = (username: string) =>
  `${getEnv('ROCKET_CHAT_SERVER')}/avatar/${username}?format=png`;

export const getRoomAvatar = (roomId: string) =>
  `${getEnv('ROCKET_CHAT_SERVER')}/avatar/room/${roomId}?format=png`;

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

export const getDownloadUrl = (file?: string) => {
  const auth = getChatAuthInfo();
  return `${getEnv('ROCKET_CHAT_SERVER')}${file}?download&rc_uid=${
    auth.userId
  }&rc_token=${auth.accessToken}`;
};

export const getDefaultAvatar = (name: string) => {
  return `${getEnv('ROCKET_CHAT_SERVER')}/avatar/${name}?format=png`;
};
