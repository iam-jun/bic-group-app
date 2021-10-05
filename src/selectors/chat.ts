import {IMessage} from './../interfaces/IChat';
/* eslint-disable no-array-constructor */
import {createSelector} from 'reselect';
import {IConversation} from '~/interfaces/IChat';

export const chatState = (state: any) => state.chat;

export const getConversations = createSelector(chatState, data => {
  return {
    ...data?.rooms,
    data: (data?.rooms?.data || [])
      .map((item: IConversation) => {
        const sub: any = (data?.subscriptions || []).find(
          (sub: any) => sub.rid === item._id,
        );

        return {
          ...item,
          // unreadCount: sub?.unread,
          unreadCount: 17,
        };
      })
      .sort(function (a: IConversation, b: IConversation) {
        //@ts-ignore
        return new Date(b._updatedAt) - new Date(a._updatedAt);
      }),
  };
});

export const getMessages = createSelector(chatState, data => {
  return {
    ...data?.messages,
    data: (data?.messages?.data || []).filter(
      (item: IMessage) => !item.type?.includes('role'),
    ),
  };
});

export const getUnreadConversationCount = createSelector(chatState, data => {
  let count = 0;
  (data?.rooms?.data || []).forEach((item: IConversation) => {
    const sub: any = (data?.subscriptions || []).find(
      (sub: any) => sub.rid === item._id,
    );
    if (typeof sub !== 'undefined' && sub.unread > 0) count++;
  });
  return count;
});

export const getUnreadMessagePosition = createSelector(chatState, data => {
  return data.messages.data.findIndex(
    (item: IMessage) => item._id === data.messages?.unreadMessage?._id,
  );
});
