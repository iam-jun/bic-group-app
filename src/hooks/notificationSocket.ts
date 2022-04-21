import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {io} from 'socket.io-client';
import {
  notificationActions,
  notificationVerbs,
} from '~/constants/notifications';
import actions from '~/screens/Notification/redux/actions';
import postActions from '~/screens/Post/redux/actions';
import {parseSafe} from '~/utils/common';
import {getEnv} from '~/utils/env';
import {getMsgPackParser} from '~/utils/socket';
import {useAuthToken, useUserIdAuth} from './auth';

const useNotificationSocket = () => {
  const dispatch = useDispatch();
  const token = useAuthToken();
  const userId = useUserIdAuth();

  const handleNotification = (data: any) => {
    switch (data.action) {
      case notificationActions.ATTACH:
        return dispatch(actions.attachNotification(data));
      case notificationActions.DETACH:
        return dispatch(actions.detachNotification(data));
      case notificationActions.UPDATE:
        return dispatch(actions.updateNotification(data));
    }
  };

  const handleReaction = (data: any) => {
    if (data.verb === notificationVerbs.REACT) {
      dispatch(postActions.updateReactionBySocket({userId, data: data}));
    }

    if (data.verb === notificationVerbs.UNREACT) {
      dispatch(postActions.updateUnReactionBySocket({userId, data: data}));
    }
  };

  // callback function when client receive realtime activity in notification feed
  // load notifications again to get new unseen number (maybe increase maybe not if new activity is grouped)
  // with this, we also not to load notification again when access Notification screen
  const handleSocketNoti = (msg: string) => {
    console.log(`\x1b[32m🐣️ Maintab: received socket noti\x1b[0m`);
    const msgData = parseSafe(msg);
    const data = msgData || {};

    handleReaction(data);

    handleNotification(data);
  };

  useEffect(() => {
    if (!token) {
      console.log(`\x1b[33m🐣️ Maintab: empty token \x1b[0m`);
      return;
    }

    dispatch(actions.getNotifications());

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
    return () => {
      socket?.disconnect?.();
    };
  }, [token]);
};

export default useNotificationSocket;
