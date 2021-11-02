import {ReactionType} from './../../constants/reactions';
import i18next from 'i18next';
import {messageEventTypes, roomTypes} from '~/constants/chat';
import {
  IAttachment,
  IChatUser,
  IConversation,
  IMessage,
} from '~/interfaces/IChat';
import {IOwnReaction, IReactionCounts} from '~/interfaces/IPost';
import {getChatAuthInfo, makeHttpRequest} from '~/services/httpApiRequest';
import {getEnv} from '~/utils/env';
import {timestampToISODate} from '~/utils/formatData';
import {messageStatus} from './../../constants/chat';
import apiConfig from '~/configs/apiConfig';

export const mapData = (user: IChatUser, dataType: string, data: any) => {
  switch (dataType) {
    case 'users':
    case 'members':
      return mapUsers(data);
    case 'search':
      return mapSearchResults(user, data);
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

export const getLastMessage = (item: IMessage, isMyMessage: boolean) => {
  if (!item) return null;
  let lastMessage = `${item.user?.name || item.user?.fullname}: ${item?.text}`;

  if ((item.attachments && item.attachments.length > 0) || item.quotedMessage) {
    lastMessage = !item.quotedMessage
      ? item.user?.username === item.user?.username
        ? i18next.t('chat:label_last_message:my_attachment')
        : i18next
            .t('chat:label_last_message:other_attachment')
            .replace('{0}', item.user?.name)
      : `${item.user?.name || item.user?.fullname}: ${item?.text}`;
  } else if (item.type) {
    // hide removed message
    if (item.type === messageEventTypes.REMOVE_MESSAGE) {
      lastMessage = i18next.t(
        `chat:system_message:${item.type}:${isMyMessage ? 'me' : 'other'}`,
      );
    } else {
      lastMessage = i18next.t(`chat:system_message:${item.type}`);
    }
  }

  return lastMessage;
};

export const mapSearchResults = (
  user: IChatUser,
  data?: any[],
): IConversation[] => {
  return (data || []).map((item: any) => {
    if (item.customFields) return mapConversation(user, item);
    else return item;
  });
};

export const mapConversation = (user: IChatUser, item: any): IConversation => {
  if (!item) return item;
  const _id = item.rid || item._id;
  const type = item.t === 'd' ? roomTypes.DIRECT : item.customFields?.type;

  const membersExcludeMe = (item.usernames || []).filter(
    (_username: any) => _username !== user?.username,
  );

  const avatar =
    type === roomTypes.DIRECT
      ? membersExcludeMe?.length > 0
        ? getAvatar(membersExcludeMe[0])
        : null
      : getRoomAvatar(_id);

  const name =
    (typeof item?.customFields?.beinChatName === 'string'
      ? item?.customFields?.beinChatName
      : item?.customFields?.beinChatName?.name) ||
    item?.fname ||
    item?.name;

  const lastMessage = item.lastMessage
    ? getLastMessage(
        mapMessage(user, item.lastMessage),
        item.lastMessage?.u.username === user.username,
      )
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
    members: item.members || item.customFields?.members,
  };
};

export const mapMessage = (_user: IChatUser, item: any): IMessage => {
  const user = mapUser(item?.u);
  const attachments: IAttachment[] = [];
  let quotedMessage = null;
  let type = item.t;

  if (item.attachments?.length > 0) {
    type = 'attachment';

    item.attachments.forEach((_attachment: any) => {
      let extraData = null;
      try {
        extraData = JSON.parse(_attachment.description || '{}');
      } catch (e: any) {
        console.log(e);
      }
      if (extraData?.type === 'reply') {
        quotedMessage = extraData;
      } else {
        attachments.push({
          ..._attachment,
          name: _attachment.title,
          ...extraData,
        });
      }
    });
  }
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

  const _message = {
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
    attachments,
    quotedMessage,
    localId: item.localId || attachments[0]?.localId,
    reaction_counts,
    own_reactions,
  };

  return {
    ..._message,
    lastMessage: getLastMessage(_message, item.u?.username === _user.username),
  };
};

export const mapUser = (item: any): IChatUser => ({
  ...item,
  ...item.customFields,
  _id: item?._id || item?.rocket_chat_id,
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

export const getReactionStatistics = async (param: {
  reactionType: ReactionType;
  messageId: string;
}) => {
  try {
    const {reactionType, messageId} = param || {};
    const response: any = await makeHttpRequest(
      apiConfig.Chat.getReactionStatistics({
        message_id: messageId,
        reaction_name: reactionType,
      }),
    );
    const data = response?.data?.data;
    const users = data.map((item: {username: string; fullname: string}) => ({
      avatar: getDefaultAvatar(item.username),
      username: item.username,
      fullname: item.fullname,
    }));

    return Promise.resolve(users || []);
  } catch (err) {
    return Promise.reject();
  }
};
