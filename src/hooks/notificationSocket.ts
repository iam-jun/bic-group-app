import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {io} from 'socket.io-client';
import notificationActionType from '~/constants/notificationActionType';
import {ISocketReaction} from '~/interfaces/IPost';
import notificationsActions from '~/screens/Notification/redux/actions';
import postActions from '~/screens/Post/redux/actions';
import {parseSafe} from '~/utils/common';
import {getEnv} from '~/utils/env';
import {getMsgPackParser} from '~/utils/socket';
import {useAuthToken, useUserIdAuth} from './auth';

const useNotificationSocket = () => {
  const dispatch = useDispatch();
  const token = useAuthToken();
  const userId = useUserIdAuth();

  // callback when someone react to a post or comment, update its ownReact and reactionCounts on UI
  const handleSocketReaction = (msg: string) => {
    console.log(`\x1b[32m🐣️ Maintab: received socket react\x1b[0m`);
    const data: ISocketReaction = parseSafe(msg);
    const payload = {userId, data};
    dispatch(postActions.updateReactionBySocket(payload));
  };

  // callback when someone un-react to a post or comment, update its ownReact and reactionCounts on UI
  const handleSocketUnReaction = (msg: string) => {
    console.log(`\x1b[32m🐣️ Maintab: received socket un-react\x1b[0m`);
    const data: ISocketReaction = parseSafe(msg);
    const payload = {userId, data};
    dispatch(postActions.updateUnReactionBySocket(payload));
  };

  // callback function when client receive realtime activity in notification feed
  // load notifications again to get new unseen number (maybe increase maybe not if new activity is grouped)
  // with this, we also not to load notification again when access Notification screen
  const handleSocketNoti = (msg: string) => {
    console.log(`\x1b[32m🐣️ Maintab: received socket noti\x1b[0m`);
    const msgData = parseSafe(msg);
    const data = msgData || {};

    if (data?.action === notificationActionType.ATTACH) {
      dispatch(notificationsActions.attachNotification(data));
    } else if (data?.action === notificationActionType.DETACH) {
      dispatch(notificationsActions.detachNotification(data));
    } else if (data?.action === notificationActionType.UPDATE) {
      dispatch(notificationsActions.updateNotification(data));
    }
  };

  useEffect(() => {
    if (!token) {
      console.log(`\x1b[33m🐣️ Maintab: empty token \x1b[0m`);
      return;
    }

    dispatch(notificationsActions.getNotifications());

    const socket = io(getEnv('BEIN_NOTIFICATION'), {
      transports: ['websocket'],
      path: '/ws',
      ...getMsgPackParser(getEnv('BEIN_FEED_WS_MSGPACK') !== 'disable'),
    });

    socket.on('connect', () => {
      console.log(
        `\x1b[36m🐣️ Bein notification socket connected with id: ${socket.id}\x1b[0m`,
      );
      socket.emit('auth_challenge', token);
    });
    socket.on('disconnect', () => {
      console.log(`\x1b[36m🐣️ Bein notification socket disconnected\x1b[0m`);
    });
    socket.on('notifications', handleSocketNoti);
    socket.on('reaction', handleSocketReaction);
    socket.on('un_reaction', handleSocketUnReaction);
    return () => {
      socket?.disconnect?.();
    };
  }, [token]);
};

export default useNotificationSocket;
