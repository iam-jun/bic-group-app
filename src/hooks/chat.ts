/* eslint-disable no-console */
import NetInfo from '@react-native-community/netinfo';
import { Auth } from 'aws-amplify';
import { debounce } from 'lodash';
import { useEffect, useRef } from 'react';
import { useUserIdAuth } from '~/hooks/auth';
import useAuthController from '~/screens/auth/store';
import { getAuthToken, getTokenExpiration } from '~/screens/auth/store/selectors';

import chatSocketClient from '~/services/chatSocket';
import { refreshTokenThenExecuteQueueRetry } from '~/api/apiRequest';
import useChatStore from '~/store/chat';
import getEnv from '~/utils/env';
import useCommonController from '~/screens/store';

const useChatSocket = () => {
  const isConnectedRef = useRef(true);

  const userId = useUserIdAuth();
  const token = useAuthController(getAuthToken);
  const tokenExp = useAuthController(getTokenExpiration);
  const myProfile = useCommonController((state) => state.myProfile);
  const initChat = useChatStore((state) => state.initChat);
  const handleChatEvent = useChatStore((state) => state.handleChatEvent);

  // use ref to avoid arrow function callback can't get the latest value of state
  const tokenRef = useRef(token);
  const tokenExpRef = useRef(tokenExp);

  const websocketOpts = {
    connectionUrl: getEnv('BEIN_CHAT_SOCKET'),
  };

  // wait 1s to avoid spam init when network change
  const connectSocket = debounce(
    () => {
      if (userId && tokenRef.current && isConnectedRef?.current) {
      // reconnect when have network back
        chatSocketClient.initialize(
          tokenRef.current, websocketOpts,
        );
        console.log(`\x1b[32m🐣️ Chat useChatSocket token ${token.slice(-10)} will expire at: ${
          new Date(tokenExp * 1000).toISOString()
        }\x1b[0m`);
      }
    }, 1000,
  );

  // wait 1s to avoid spam init when network change
  const refreshToken = debounce(
    async () => {
      const sessionData = await Auth.currentSession();
      const idToken = sessionData?.getIdToken().getJwtToken();
      if (idToken === tokenRef.current) {
        console.log('\x1b[31m🐣️ chat refreshtoken token not refresh yet\x1b[0m');
        // token expire but not refresh yet, delay and retry
        refreshToken();
        return;
      }
      await refreshTokenThenExecuteQueueRetry('');
    }, 1000,
  );

  useEffect(
    () => {
      const unsubscribe = NetInfo.addEventListener((state) => {
        isConnectedRef.current = state.isConnected || false;
        if (isConnectedRef.current) {
          connectSocket();
        }
      });
      return () => {
        unsubscribe?.();
      };
    }, [],
  );

  useEffect(
    () => {
      if (userId) {
        initChat();
      }
      chatSocketClient.setEventCallback((evt: any) => handleChatEvent(myProfile.chatUserId, evt));
      // chatSocketClient.setErrorCallback(async (evt: any) => {}); //error callback not work on iOS
      chatSocketClient.setCloseCallback(() => {
        if (!isConnectedRef.current) {
          console.log('\x1b[31m🐣️ useChatSocket network error, skipped!\x1b[0m');
          chatSocketClient.close(true);
          return;
        }
        const isTokenExpired = checkTokenExpired(tokenExpRef.current);
        if (isTokenExpired) {
          chatSocketClient.close(true); // close to disable retry
          refreshToken();
        }
      });
    }, [userId, myProfile?.chatUserId],
  );

  useEffect(
    () => {
      if (!token) {
      // disconnect socket when navigate to login screen
        chatSocketClient.close(true);
        return;
      }

      connectSocket();

      return () => {
        chatSocketClient.close(true);
      };
    }, [token],
  );

  useEffect(
    () => {
      tokenRef.current = token;
    }, [token],
  );

  useEffect(
    () => {
      tokenExpRef.current = tokenExp;
    }, [tokenExp],
  );

  return {};
};

export default useChatSocket;

const checkTokenExpired = (tokenExp: number) => {
  const nowMs = new Date().getTime() / 1000;
  return (tokenExp || 0) - nowMs < 0;
};
