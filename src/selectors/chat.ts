import { useMemo } from 'react';
import { createSelector } from 'reselect';
import useChatStore, { ChatState } from '~/store/chat'

export const chatState = (state: any) => state.chat;

export const getUnreadChannelCount = ():number => {
  const { unreadChannels }: ChatState = useChatStore();

  return useMemo(() => {
    let count = 0;
    const channels = Object.keys(unreadChannels);

    (channels || []).forEach((key: string) => {
      const channel: any = unreadChannels[key];
      if (typeof channel !== 'undefined' && channel.mentionCountRoot > 0) count += 1;
    });

    return count;
  }, [unreadChannels]);
}
