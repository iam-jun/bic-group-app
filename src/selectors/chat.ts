import { createSelector } from 'reselect';

export const chatState = (state: any) => state.chat;

export const getUnreadChannelCount = createSelector(chatState, (data) => {
  let count = 0;
  const unreadchannels = data?.unreadChannels;
  const channels = Object.keys(unreadchannels);

  (channels || []).forEach((key: string) => {
    const channel: any = unreadchannels[key];
    if (typeof channel !== 'undefined' && channel.mention_count_root > 0) count += 1;
  });
  return count;
});
