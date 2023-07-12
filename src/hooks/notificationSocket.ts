/* eslint-disable no-console */
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  notificationActions,
  notificationEvent,
} from '~/constants/notifications';
import useAuthController from '~/screens/auth/store';
import { getAuthToken } from '~/screens/auth/store/selectors';
import { parseSafe } from '~/utils/common';
import ConvertHelper from '~/utils/convertHelper';
import getEnv from '~/utils/env';
import { getMsgPackParser } from '~/utils/socket';
import { useUserIdAuth } from './auth';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import useCommonController from '~/screens/store';
import INotificationsState from '~/screens/Notification/store/Interface';
import useNotificationStore from '~/screens/Notification/store';
import usePostsInProgressStore from '~/screens/Home/components/VideoProcessingNotice/store';
import useUserBadge from '~/screens/Menu/UserProfile/fragments/BadgeCollection/store';
import { handleQuizNotificationSocket } from '~/screens/quiz/helper';

const useNotificationSocket = () => {
  const token = useAuthController(getAuthToken);
  const userId = useUserIdAuth();
  const commonController = useCommonController((state) => state.actions);
  const notiActions = useNotificationStore(
    (state: INotificationsState) => state.actions,
  );
  const postActions = usePostsInProgressStore((state) => state.actions);
  const userBadgeActions = useUserBadge((state) => state.actions);

  const handleNotification = (data: any) => {
    switch (data.action) {
      case notificationActions.ATTACH:
        if (
          data?.extra?.type
            === NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL
          || data?.extra?.type
            === NOTIFICATION_TYPE.POST_VIDEO_TO_USER_UNSUCCESSFUL
        ) {
          postActions.updatePosts(data);
        }

        if (
          data?.extra?.type === NOTIFICATION_TYPE.CHANGE_USER_BADGE_COLLECTION
        ) {
          userBadgeActions.getOwnedBadges();
        }

        if (
          [
            NOTIFICATION_TYPE.QUIZ_GENERATE_SUCCESSFUL,
            NOTIFICATION_TYPE.QUIZ_GENERATE_UNSUCCESSFUL,
          ].includes(data?.extra?.type)
        ) {
          handleQuizNotificationSocket(data);
        }

        return notiActions.attach(data);
      case notificationActions.DETACH:
        return notiActions.detach(data);

      case notificationActions.UPDATE:
        return notiActions.update(data);

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
    console.log(
      '\x1b[36m🐣️ notificationSocket receive socket noti \x1b[0m',
      msg,
    );
    const msgData = ConvertHelper.camelizeKeys(parseSafe(msg));
    const data = msgData || {};
    handleNotification(data);
  };

  const handleInternalEvent = (msg: string) => {
    console.log('\x1b[36m🐣️ notificationSocket receive internal event\x1b[0m');
    const msgData = ConvertHelper.camelizeKeys(parseSafe(msg), {
      excludeValueOfKey: ['reactions_count'],
    });
    const data: any = msgData || {};
    if (
      data?.event === notificationEvent.REACT
      || data?.event === notificationEvent.UNREACT
    ) {
      commonController.updateReactionBySocket({ userId, data });
    }
  };

  useEffect(() => {
    if (!token) {
      console.log('\x1b[33m🐣️ Maintab: empty token \x1b[0m');
      return;
    }

    notiActions.getTabData();

    const socket = io(getEnv('BEIN_API'), {
      transports: ['websocket'],
      path: getEnv('BEIN_NOTIFICATION_WS_PATH'),
      ...getMsgPackParser(getEnv('BEIN_FEED_WS_MSGPACK') !== 'disable'),
    });

    console.log(
      `\x1b[37m🐣️ Bein notification socket will connect with token ${token.slice(
        -10,
      )}\x1b[0m`,
    );
    socket.on('connect', () => {
      console.log(
        `\x1b[32m🐣️ Bein notification socket connected with id: ${socket.id}\x1b[0m`,
      );
      socket.emit('auth_challenge', token);
    });
    socket.on('disconnect', (reason) => {
      console.log(
        `\x1b[31m🐣️ Bein notification socket disconnected: ${reason}\x1b[0m`,
      );
    });
    socket.on('notifications', handleSocketNoti);
    socket.on('internal_event', handleInternalEvent);

    return () => {
      socket?.disconnect?.();
    };
  }, [token]);
};

export default useNotificationSocket;
