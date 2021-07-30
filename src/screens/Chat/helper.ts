import {generateAvatar} from '~/utils/common';
import {IUser} from '~/interfaces/IAuth';
import {IConversation, IMessage} from '~/interfaces/IChat';
import {generateRoomName} from '~/utils/generator';

export const mapConversations = (user: IUser, data?: []): IConversation[] =>
  (data || []).map((item: any) => mapConversation(user, item));

export const mapMessages = (data?: []): IMessage[] =>
  (data || []).map((item: any) => mapMessage(item));

export const mapConversation = (user: IUser, item: any): IConversation => {
  const name =
    item?.customFields?.name || generateRoomName(user, item?.usernames || []);
  return {
    ...item,
    _id: item?._id || item?.rid,
    name,
    type: item?.t,
    avatar: generateAvatar(name),
    user: mapUser(item?.u),
    lastMessage: item?.lastMessage?.msg,
  };
};

export const mapMessage = (item: any): IMessage => ({
  ...item,
  room_id: item?.rid,
  user: mapUser(item?.u),
  updateAt: item?._updateAt,
  text: item?.msg,
});

export const mapUser = (item: any) => ({
  ...item,
  avatar:
    item?.avatarOrigin ||
    generateAvatar(item?.name || item?.fullname || item?.username),
  name: item?.name || item?.fullname || item?.username,
});
