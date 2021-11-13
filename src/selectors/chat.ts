/* eslint-disable no-array-constructor */
import {createSelector} from 'reselect';
import {IConversation} from '~/interfaces/IChat';

export const chatState = (state: any) => state.chat;

export const getConversations = createSelector(chatState, data => {
  return {
    ...data?.rooms,
    data: Object.keys(data?.rooms?.data || {})
      .map((key: string) => {
        const item = data?.rooms?.data?.[key];
        const sub: any = (data?.subscriptions || []).find(
          (sub: any) => sub.rid === item._id,
        );

        const name =
          (typeof sub?.customFields?.beinChatName === 'string'
            ? sub?.customFields?.beinChatName
            : sub?.customFields?.beinChatName?.name) ||
          sub?.fname ||
          sub?.name;

        return {
          ...item,
          unreadCount: sub?.unread,
          name,
        };
      })
      .sort(function (a: IConversation, b: IConversation) {
        //@ts-ignore
        return new Date(b._updatedAt) - new Date(a._updatedAt);
      }),
  };
});

export const getUnreadConversationCount = createSelector(chatState, data => {
  let count = 0;
  Object.keys(data?.rooms?.data || {}).forEach((key: string) => {
    const item = data?.rooms?.data?.[key];
    const sub: any = (data?.subscriptions || []).find(
      (sub: any) => sub.rid === item._id,
    );
    if (typeof sub !== 'undefined' && sub.unread > 0) count++;
  });
  return count;
});
