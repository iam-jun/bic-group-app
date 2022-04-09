import NetInfo from '@react-native-community/netinfo';
import {useEffect, useRef} from 'react';
import {useAuthToken, useAuthTokenExpire, useUserIdAuth} from '~/hooks/auth';

import chatSocketClient from '~/services/chatSocket';
import chatAction from '~/store/chat/actions';
import {getTokenAndCallBackBein} from '~/services/httpApiRequest';
import {useDispatch} from 'react-redux';
import {getEnv} from '~/utils/env';
import {debounce} from 'lodash';

export const useChatSocket = () => {
  const isConnectedRef = useRef(true);

  const userId = useUserIdAuth();
  const token = useAuthToken();
  const tokenExp = useAuthTokenExpire();
  const dispatch = useDispatch();

  const websocketOpts = {
    connectionUrl: getEnv('BEIN_CHAT_SOCKET'),
  };

  console.log(
    `\x1b[32m🐣️ chat useChatSocket token will expire at: ${new Date(
      tokenExp * 1000,
    ).toISOString()}\x1b[0m`,
  );

  // wait 1s to avoid spam init when network change
  const connectSocket = debounce(() => {
    if (userId && token && isConnectedRef?.current) {
      // reconnect when have network back
      chatSocketClient.initialize(token, websocketOpts);
    }
  }, 1000);

  // wait 1s to avoid spam init when network change
  const refreshToken = debounce(async () => {
    await getTokenAndCallBackBein('');
  }, 1000);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      isConnectedRef.current = state.isConnected || false;
      if (isConnectedRef.current) {
        connectSocket();
      }
    });
    return () => {
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    dispatch(chatAction.initChat());
    chatSocketClient.setEventCallback((evt: any) =>
      dispatch(chatAction.handleChatEvent(evt)),
    );
    // chatSocketClient.setErrorCallback(async (evt: any) => {}); //error callback not work on iOS
    chatSocketClient.setCloseCallback(() => {
      if (!isConnectedRef.current) {
        console.log(`\x1b[31m🐣️ useChatSocket network error, skipped!\x1b[0m`);
        chatSocketClient.close(true);
        return;
      }
      if (isTokenExpired()) {
        chatSocketClient.close(true); //close to disable retry
        refreshToken();
      }
    });
  }, [userId]);

  useEffect(() => {
    if (!token) {
      // disconnect socket when navigate to login screen
      chatSocketClient.close(true);
      return;
    }

    chatSocketClient.initialize(token, websocketOpts);

    return () => {
      chatSocketClient.close(true);
    };
  }, [token]);

  const isTokenExpired = () => {
    const nowMs = new Date().getTime() / 1000;
    return (tokenExp || 0) - nowMs < 0;
  };

  return {};
};
