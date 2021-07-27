/* eslint-disable no-array-constructor */
import {createSelector} from 'reselect';
import {IObject} from '~/interfaces/common';

const state = (state: IObject<any>) => state.chat;

export const getConversations = createSelector(state, data => {
  return data?.conversations.data.map((item: any) => ({
    ...item,
    id: item._id,
    type: item.t,
    user: item.u,
    updateAt: item._updateAt,
    lastMessage: item.lastMessage?.msg,
  }));
});
