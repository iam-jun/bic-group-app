import {generateAvatar} from '~/utils/common';
import {IUser} from '~/interfaces/IAuth';
import {IConversation, IMessage} from '~/interfaces/IChat';
import {generateRoomName} from '~/utils/generator';

export const mapConversation = (user: IUser, data?: []): IConversation[] =>
  (data || []).map((item: any) => ({
    ...item,
    name: item?.name || generateRoomName(user, item?.usernames),
    type: item?.t,
    user: mapUser(item?.u),
    lastMessage: item?.lastMessage?.msg,
  }));

export const mapMessage = (data?: []): IMessage[] =>
  (data || []).map((item: any) => ({
    ...item,
    room_id: item?.rid,
    user: mapUser(item?.u),
    updateAt: item?._updateAt,
    text: item?.msg,
  }));

export const mapUser = (item: any) => ({
  ...item,
  avatar: item?.avatarOrigin || generateAvatar(item?.name || item?.username),
  name: item?.name || item?.username,
});
