import _ from 'lodash';

import {getChatAuthInfo, refreshAuthTokens} from '~/services/httpApiRequest';
import {getEnv} from '~/utils/env';

export const ManualSocketCloseCodeDefault = 4567;

// export interface SocketChatParams {
//   onOpen?: () => void;
//   onMessage?: (event: WebSocketMessageEvent) => void;
//   onClose?: (event: WebSocketCloseEvent) => void;
//   onError?: (event: WebSocketErrorEvent) => void;
// }

interface OnMessageCallback {
  id: string;
  callback: (event: WebSocketMessageEvent) => void;
}

let socket: WebSocket | undefined;
let manualSocketCloseCode: number;
let rocketChatAuthToken: string;
let messageQueue: any[] = [];
let isAuthRefreshing = false;
let onMessageCallbacks: Array<OnMessageCallback> = [];
let countRetryConnect = 0;

const connectChat = () => {
  if (socket && socket.readyState == 1) {
    return;
  }
  socket = new WebSocket(getEnv('SOCKET_ROCKET_CHAT'));
  _setupSocket();
};

const closeConnectChat = () => {
  onMessageCallbacks = [];
  manualSocketCloseCode = ManualSocketCloseCodeDefault;
  socket && socket.close();
};

const addOnMessageCallback = (
  id: string,
  callback: (event: WebSocketMessageEvent) => void,
): (() => void) => {
  onMessageCallbacks.push({id, callback});
  return () => {
    removeOnMessageCallback(id);
  };
};

const removeOnMessageCallback = (id: string) => {
  _.remove(onMessageCallbacks, item => {
    return item.id === id;
  });
};

const sendMessage = (data: any) => {
  if (socket?.readyState !== 1) {
    waitForSocketConnection(function () {
      sendMessage(data);
    });
    return;
  }
  const dataSubmit = JSON.stringify(data);
  socket && socket.send(dataSubmit);

  if (!data.id || data.msg !== 'method') {
    return;
  }
  messageQueue.push(data);
};

const waitForSocketConnection = (callback?: any) => {
  if (countRetryConnect > 10) {
    return;
  }
  setTimeout(function () {
    if (socket?.readyState === 1) {
      countRetryConnect = 0;
      console.log('connection is made.');
      callback && callback();
    } else {
      countRetryConnect++;
      console.log(countRetryConnect, 'wait for connection...');
      waitForSocketConnection(callback);
    }
  }, 100);
};

const _login = () => {
  sendMessage({
    msg: 'method',
    method: 'login',
    id: 'bein-login', // TODO: rename?
    params: [
      {
        resume: rocketChatAuthToken,
      },
    ],
  });
};

const _onOpenDefault = () => {
  console.log('onOpenDefault'); // TODO: comment
  sendMessage({
    msg: 'connect',
    version: '1',
    support: ['1'],
  });
  _login();
};

const _onCloseDefault = (event: WebSocketCloseEvent) => {
  console.log('onCloseDefault:', event); // TODO: comment
  if (manualSocketCloseCode === ManualSocketCloseCodeDefault && socket) {
    socket.onopen = null;
    socket.onclose = null;
    socket.onerror = null;
    socket.onmessage = null;
    socket = undefined;
    manualSocketCloseCode = 0;
    return;
  }
  socket = new WebSocket(getEnv('SOCKET_ROCKET_CHAT'));
  _setupSocket();
};

const _onErrorDefault = (event: WebSocketErrorEvent) => {
  console.log('onErrorDefault:', event); // TODO: comment
};

const _setupAuthInfo = () => {
  const {accessToken} = getChatAuthInfo();
  rocketChatAuthToken = accessToken;
};

const _onMessageMustHave = (event: WebSocketMessageEvent) => {
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
    isAuthRefreshing = true;
    refreshAuthTokens().then(success => {
      if (!success) {
        messageQueue = [];
        isAuthRefreshing = false;
        return;
      }
      _setupAuthInfo();

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
  _.remove(messageQueue, function (item) {
    return item.id === data.id;
  });
};

const _setupSocket = () => {
  _setupAuthInfo();

  if (!socket) {
    return;
  }

  socket.onopen = _onOpenDefault;
  socket.onclose = _onCloseDefault;
  socket.onmessage = (event: WebSocketMessageEvent) => {
    _onMessageMustHave(event);
    onMessageCallbacks.forEach(i => i.callback(event));
  };
  // @ts-ignore
  socket.onerror = _onErrorDefault;
};

export {
  socket, // always check socket null
  OnMessageCallback,
  connectChat,
  closeConnectChat,
  addOnMessageCallback,
  removeOnMessageCallback,
  sendMessage,
};
