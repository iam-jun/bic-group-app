import { parseSafe } from '~/utils/common';

export const handlePostedEvent = (payload: any, unreadChannels:any, userId: string) => {
  const mentions = parseSafe(payload.data.mentions);
  const post = parseSafe(payload.data.post);

  if (mentions?.includes(userId) && !post.root_id) {
    const id = payload.broadcast.channel_id;
    let channel = unreadChannels[id];
    if (!channel) {
      channel = { id, mentionCountRoot: 1 };
    } else {
      channel = { id, mentionCountRoot: channel.mentionCountRoot + 1 };
    }
    return channel;
  }
  return null;
};

export const handleChannelViewedEvent = (payload: any) => {
  const id = payload.data.channel_id;
  const channel = { id, mentionCountRoot: 0 };
  return channel;
};

export const handlePostUnreadEvent = (payload: any) => {
  const id = payload.broadcast.channel_id;
  const channel = { id, mentionCountRoot: payload.data.mention_count_root };

  return channel;
};
