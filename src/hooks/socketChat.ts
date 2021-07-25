import {useEffect, useRef} from 'react';
import Config from 'react-native-config';

import {getChatAuthInfo, refreshAuthTokens} from '~/services/httpApiRequest';

interface SocketChatParams {
  onOpen?: () => void;
  onMessage?: (event: WebSocketMessageEvent) => void;
  onClose?: (event: WebSocketCloseEvent) => void;
  onError?: (event: WebSocketErrorEvent) => void;
}

const useSocketChat = (args?: SocketChatParams) => {
  let {current: socket} = useRef<WebSocket>(
    new WebSocket(
      Config.SOCKET_ROCKET_CHAT || 'wss://chat.bein.global/websocket',
    ), // TODO: remove
  );

  let rocketChatAuthToken: string;
  let messageQueue: any[] = [];
  let isAuthRefreshing = false;

  const sendMessage = (data: any) => {
    if (socket.readyState !== 1) {
      return;
    }
    const dataSubmit = JSON.stringify(data);
    socket && socket.send(dataSubmit);

    if (!data.id || data.msg !== 'method') {
      return;
    }
    messageQueue.push(data);
  };

  const login = () => {
    sendMessage({
      msg: 'method',
      method: 'login',
      id: 'bein-login',
      params: [
        {
          resume:
            rocketChatAuthToken ||
            'iT-LOMvPrSSyFWQesdacbwkRa4CDPIQp_CRoph9YM2X', // TODO: remove
        },
      ],
    });
  };

  const onOpenDefault = () => {
    console.log('onOpenDefault - connected!'); // TODO: remove
    sendMessage({
      msg: 'connect',
      version: '1',
      support: ['1'],
    });
    login();
  };

  const onCloseDefault = (event: WebSocketCloseEvent) => {
    console.log('onCloseDefault:', event); // TODO: remove
    socket = new WebSocket('wss://chat.bein.global/websocket');
    setupSocket();
  };

  const onErrorDefault = (event: WebSocketErrorEvent) => {
    console.log('onErrorDefault:', event); // TODO: remove
  };

  const onMessageMustHave = (event: WebSocketMessageEvent) => {
    const data = JSON.parse(event.data);
    if (data.msg == 'ping') {
      sendMessage({msg: 'pong'});
      return;
    }
    // handle unauthorized
    /*
     * {
     *  "msg":"result",
     *  "id":"GgPqnLAtuBMt6Zsch",
     *  "error":{"isClientSafe":true,"error":403,
     *    "reason":"You've been logged out by the server. Please log in again.",
     *    "message":"You've been logged out by the server. Please log in again. [403]",
     *    "errorType":"Meteor.Error"
     *   }
     * }
     * */
    if (data.error?.error === 403 && !isAuthRefreshing) {
      refreshAuthTokens().then(success => {
        if (!success) {
          return;
        }
        setupAuthInfo();

        // handle retry
        const messageNeedRetry = messageQueue.filter(item => {
          return item.id === data.id;
        });
        messageNeedRetry.forEach(message => {
          sendMessage(message);
        });

        messageQueue = [];
        isAuthRefreshing = false;
      });
      return;
    }
    messageQueue = [];
  };

  const setupAuthInfo = () => {
    const {accessToken} = getChatAuthInfo();
    rocketChatAuthToken = accessToken;
  };

  const setupSocket = () => {
    setupAuthInfo();
    const {
      onOpen = onOpenDefault,
      onClose = onCloseDefault,
      onMessage,
      onError = onErrorDefault,
    } = {...args};

    socket.onopen = onOpen;
    socket.onclose = onClose;
    socket.onmessage = (event: WebSocketMessageEvent) => {
      onMessageMustHave(event);
      onMessage && onMessage(event);
    };
    // @ts-ignore
    socket.onerror = onError;
  };

  setupSocket();

  useEffect(() => {
    return () => {
      socket && socket.close();
    };
  }, [socket]);
  return sendMessage;
};

export default useSocketChat;
