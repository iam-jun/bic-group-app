import NetInfo from '@react-native-community/netinfo';
import {useEffect, useRef} from 'react';
import {useAuthToken, useUserIdAuth} from '~/hooks/auth';

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
  const dispatch = useDispatch();

  const websocketOpts = {
    connectionUrl: getEnv('BEIN_CHAT_SOCKET'),
  };

  // wait 1s to avoid spam init when network change
  const connectSocket = debounce(() => {
    if (userId && token && isConnectedRef?.current) {
      // reconnect when have network back
      chatSocketClient.initialize(token, websocketOpts);
    }
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
    chatSocketClient.setErrorCallback(async (evt: any) => {
      if (!isConnectedRef.current) {
        console.log(`\x1b[31m🐣️ useChatSocket network error, skipped!\x1b[0m`);
        chatSocketClient.close(true);
        return;
      }

      if (evt?.isTrusted === false) {
        chatSocketClient.close(true);
        await getTokenAndCallBackBein('');
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

  return {};
};
