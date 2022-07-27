import { put, select } from 'redux-saga/effects';
import chatSocketEvents from '~/constants/chatSocketEvents';
import { IObject } from '~/interfaces/common';
import actions from '../actions';

export default function* handleChatEvent({
  payload,
}: {
  payload: any;
  type: string;
}) {
  switch (payload.event) {
    case chatSocketEvents.POSTED:
      yield handlePostedEvent(payload);
      break;
    case chatSocketEvents.CHANNEL_VIEWED:
      yield handleChannelViewedEvent(payload);
      break;
    case chatSocketEvents.POST_UNREAD:
      yield handlePostUnreadEvent(payload);
      break;
    default:
      break;
  }
}

function* handlePostedEvent(payload: any) {
  try {
    const channels: IObject<any> = yield select((state: any) => state.chat.unreadChannels);
    const myProfile: IObject<any> = yield select((state: any) => state.menu.myProfile);
    const mentions = JSON.parse(payload.data.mentions);
    const post = JSON.parse(payload.data.post);

    if (mentions.includes(myProfile.chat_user_id) && !post.root_id) {
      const id = payload.broadcast.channel_id;
      let channel = channels[id];
      if (!channel) {
        channel = { [id]: { mention_count_root: 1 } };
      } else {
        channel = { [id]: { mention_count_root: channel.mention_count_root + 1 } };
      }
      yield put(actions.updateChannelNotificationCount(channel));
    }
  } catch (err: any) {
    console.error(
      'handlePostedEvent', err,
    );
  }
}

function* handleChannelViewedEvent(payload: any) {
  try {
    const id = payload.data.channel_id;
    const channel = { [id]: { mention_count_root: 0 } };

    yield put(actions.updateChannelNotificationCount(channel));
  } catch (err: any) {
    console.error(
      'handlePostedEvent', err,
    );
  }
}

function* handlePostUnreadEvent(payload: any) {
  try {
    const id = payload.broadcast.channel_id;
    const channel = {
      [id]: { mention_count_root: payload.data.mention_count_root },
    };

    yield put(actions.updateChannelNotificationCount(channel));
  } catch (err: any) {
    console.error(
      'handlePostUnreadEvent', err,
    );
  }
}
