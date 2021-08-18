import {generateRoomName} from '~/utils/generator';
import i18next from 'i18next';
import {roomTypes} from '~/constants/chat';
import {IUser} from '~/interfaces/IAuth';
import {IConversation, IMessage} from '~/interfaces/IChat';
import {getEnv} from '~/utils/env';
import {timestampToISODate} from '~/utils/formatData';

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
    (member: any) => member.username !== user.username,
  );

  const name =
    type === roomTypes.DIRECT
      ? members?.length > 0
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

  return {
    ...item,
    _id,
    name,
    usernames,
    type: item.customFields?.type,
    avatar,
    user: mapUser(item?.u),
    lastMessage: item?.lastMessage?.msg,
    _updatedAt: timestampToISODate(item._updatedAt),
  };
};

export const mapMessage = (item: any): IMessage => {
  const user = mapUser(item?.u);
  return {
    ...item,
    room_id: item?.rid,
    user,
    type: item.t,
    system: !!item.t,
    createdAt: timestampToISODate(item.ts),
    _updatedAt: timestampToISODate(item._updatedAt),
    text: item.t
      ? i18next
          .t(`chat:system_message_${item.t}`)
          .replace('{0}', user.name || '')
          .replace('{1}', item.msg)
      : item?.msg,
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
