import {Config} from 'react-native-config';
import i18next from 'i18next';
import {generateAvatar} from '~/utils/common';
import {IUser} from '~/interfaces/IAuth';
import {IConversation, IMessage} from '~/interfaces/IChat';
import {generateRoomName} from '~/utils/generator';
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
  const name =
    item?.topic ||
    generateRoomName(user, item?.usernames || []) ||
    item.u?.name;
  return {
    ...item,
    _id: item?._id || item?.rid,
    name,
    type: item?.t,
    avatar: getAvatar(item.name),
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
          .replace('{0}', user.name)
          .replace('{1}', item.msg)
      : item?.msg,
  };
};

export const mapUser = (item: any) => ({
  ...item,
  avatar: getAvatar(item.username),
  name: item?.name || item?.fullname || item?.username,
});

export const getAvatar = (username: string) =>
  `${Config.ROCKET_CHAT_SERVER}avatar/${username}`;
