/* eslint-disable no-array-constructor */
import {Platform} from 'react-native';
import {createSelector} from 'reselect';
import {IConversation} from '~/interfaces/IChat';

export const chatState = (state: any) => state.chat;

export const getConversations = createSelector(chatState, data => {
  return {
    ...data?.groups,
    data: (data?.groups?.data || [])
      .map((item: IConversation) => {
        const sub: any = (data?.subscriptions || []).find(
          (sub: any) => sub.rid === item._id,
        );

        return {
          ...item,
          unreadCount: sub?.unread
            ? sub.unread > 9
              ? '9+'
              : `${sub.unread}`
            : null,
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
  (data?.groups?.data || []).forEach((item: IConversation) => {
    const sub: any = (data?.subscriptions || []).find(
      (sub: any) => sub.rid === item._id,
    );
    if (typeof sub !== 'undefined' && sub.unread > 0) count++;
  });
  return count;
});
