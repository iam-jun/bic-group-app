/* eslint-disable no-array-constructor */
import {createSelector} from 'reselect';

export const chatState = (state: any) => state.chat;

export const getConversations = createSelector(chatState, data => {
  const {data: roomsData, items} = data.rooms || {};

  return (roomsData || [])
    .map((key: string) => {
      const item = items?.[key];
      const sub = data?.subscriptions[key];
      const {data: messagesData, items: messageItems} =
        data?.messages?.[key] || {};

      const _lastMessage =
        messageItems?.[messagesData?.[messagesData?.length - 1]];
      const lastMessage =
        _lastMessage && !_lastMessage.system ? _lastMessage : item?.lastMessage;

      return {
        ...item,
        unreadCount: sub?.unread,
        lastMessage,
        _updatedAt: lastMessage ? lastMessage?.createAt : item._updatedAt,
      };
    })
    .sort(function (a: any, b: any) {
      //@ts-ignore
      return new Date(b._updatedAt) - new Date(a._updatedAt);
    });
});

export const getUnreadConversationCount = createSelector(chatState, data => {
  let count = 0;
  (data?.rooms?.data || []).forEach((key: string) => {
    const sub: any = data?.subscriptions?.[key];
    if (typeof sub !== 'undefined' && sub.unread > 0) count++;
  });
  return count;
});
