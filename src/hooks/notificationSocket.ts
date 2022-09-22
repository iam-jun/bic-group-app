/* eslint-disable no-console */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import {
  notificationActions,
  notificationEvent,
} from '~/constants/notifications';
import actions from '~/storeRedux/notification/actions';
import postActions from '~/storeRedux/post/actions';
import { parseSafe } from '~/utils/common';
import getEnv from '~/utils/env';
import { getMsgPackParser } from '~/utils/socket';
import { useAuthToken, useUserIdAuth } from './auth';
import ConvertHelper from '~/utils/convertHelper';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';

const useNotificationSocket = () => {
  const dispatch = useDispatch();
  const token = useAuthToken();
  const userId = useUserIdAuth();

  const handleNotification = (data: any) => {
    switch (data.action) {
      case notificationActions.ATTACH:
        if (
          data?.extra?.type
            === NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL
          || data?.extra?.type
            === NOTIFICATION_TYPE.POST_VIDEO_TO_USER_UNSUCCESSFUL
        ) {
          dispatch(postActions.updateAllPostContainingVideoInProgress(data));
        }
        return dispatch(actions.attachNotification(data));
      case notificationActions.DETACH:
        return dispatch(actions.detachNotification(data));
      case notificationActions.UPDATE:
        return dispatch(actions.updateNotification(data));
      default:
        return null;
    }
  };

  /*
    callback function when client receive realtime activity in notification feed
    load notifications again to get new unseen number
    (maybe increase maybe not if new activity is grouped)
    with this, we also not to load notification again when access Notification screen
   */
  const handleSocketNoti = (msg: string) => {
    console.log('\x1b[36m🐣️ notificationSocket receive socket noti \x1b[0m');
    const msgData = ConvertHelper.camelizeKeys(parseSafe(msg));
    const data = msgData || {};
    handleNotification(data);
  };

  const handleInternalEvent = (msg: string) => {
    console.log('\x1b[36m🐣️ notificationSocket receive internal event\x1b[0m');
    const msgData = ConvertHelper.camelizeKeys(parseSafe(msg), {
      excludeValueOfKey: ['reactions_count'],
    });
    // console.log(
    //   `\x1b[34m🐣️ notificationSocket handleInternalEvent`,
    //   `${JSON.stringify(msgData, undefined, 2)}\x1b[0m`,
    // );
    const data: any = msgData || {};
    if (
      data?.event === notificationEvent.REACT
      || data?.event === notificationEvent.UNREACT
    ) {
      dispatch(postActions.updateReactionBySocket({ userId, data }));
    }
  };

  useEffect(
    () => {
      if (!token) {
        console.log('\x1b[33m🐣️ Maintab: empty token \x1b[0m');
        return;
      }

      dispatch(actions.getNotifications());

      const socket = io(
        getEnv('BEIN_API'), {
          transports: ['websocket'],
          path: getEnv('BEIN_NOTIFICATION_WS_PATH'),
          ...getMsgPackParser(getEnv('BEIN_FEED_WS_MSGPACK') !== 'disable'),
        },
      );

      console.log(`\x1b[37m🐣️ Bein notification socket will connect with token ${token.slice(-10)}\x1b[0m`);
      socket.on(
        'connect', () => {
          console.log(`\x1b[32m🐣️ Bein notification socket connected with id: ${socket.id}\x1b[0m`);
          socket.emit(
            'auth_challenge', token,
          );
        },
      );
      socket.on(
        'disconnect', (reason) => {
          console.log(`\x1b[31m🐣️ Bein notification socket disconnected: ${reason}\x1b[0m`);
        },
      );
      socket.on(
        'notifications', handleSocketNoti,
      );
      socket.on(
        'internal_event', handleInternalEvent,
      );

      return () => {
        socket?.disconnect?.();
      };
    }, [token],
  );
};

export default useNotificationSocket;
