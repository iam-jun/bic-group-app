// import _ from 'lodash';
// import {useEffect, useRef, useState} from 'react';
// import Config from 'react-native-config';
//
// import {getChatAuthInfo, refreshAuthTokens} from '~/services/httpApiRequest';
//
// export const ManualSocketCloseCodeDefault = 4567;
//
// export interface SocketChatParams {
//   onOpen?: () => void;
//   onMessage?: (event: WebSocketMessageEvent) => void;
//   onClose?: (event: WebSocketCloseEvent) => void;
//   onError?: (event: WebSocketErrorEvent) => void;
// }
//
// const useSocketChat = (args?: SocketChatParams) => {
//   let [socket] = useState<WebSocket>(
//     new WebSocket(
//       'wss://rockettest.bein.group/websocket' || Config.SOCKET_ROCKET_CHAT,
//     ), // TODO: remove
//   );
//   const [waitingToReconnect, setWaitingToReconnect] = useState<boolean>(
//     false,
//   );
//
//   let manualSocketCloseCode: number;
//   let rocketChatAuthToken: string;
//   let messageQueue: any[] = [];
//   let isAuthRefreshing = false;
//
//   const closeConnect = () => {
//     manualSocketCloseCode = ManualSocketCloseCodeDefault;
//     socket && socket.close();
//   };
//
//   const sendMessage = (data: any) => {
//     console.log('sendMessageSocket:', socket?.readyState)
//     if (socket?.readyState !== 1) {
//       return;
//     }
//     const dataSubmit = JSON.stringify(data);
//     socket && socket.send(dataSubmit);
//
//     if (!data.id || data.msg !== 'method') {
//       return;
//     }
//     messageQueue.push(data);
//   };
//
//   const login = () => {
//     sendMessage({
//       msg: 'method',
//       method: 'login',
//       id: 'bein-login',
//       params: [
//         {
//           resume: rocketChatAuthToken, // TODO: remove
//         },
//       ],
//     });
//   };
//
//   const onOpenDefault = () => {
//     console.log('onOpenDefault - connected!'); // TODO: remove
//     sendMessage({
//       msg: 'connect',
//       version: '1',
//       support: ['1'],
//     });
//     login();
//   };
//
//   const onCloseDefault = (event: WebSocketCloseEvent) => {
//     console.log('onCloseDefault:', event); // TODO: remove
//     if (manualSocketCloseCode === ManualSocketCloseCodeDefault) {
//       return;
//     }
//     console.log('yeah');
//     setWaitingToReconnect(true);
//   };
//
//   const onErrorDefault = (event: WebSocketErrorEvent) => {
//     console.log('onErrorDefault:', event); // TODO: remove
//   };
//
//   const {
//     onOpen = onOpenDefault,
//     onClose = onCloseDefault,
//     onMessage,
//     onError = onErrorDefault,
//   } = {...args};
//
//   const onMessageMustHave = (event: WebSocketMessageEvent) => {
//     const data = JSON.parse(event.data);
//     if (data.msg == 'ping') {
//       sendMessage({msg: 'pong'});
//       return;
//     }
//     // handle unauthorized
//     /*
//      * {
//      *  "msg":"result",
//      *  "id":"GgPqnLAtuBMt6Zsch",
//      *  "error":{"isClientSafe":true,"error":403,
//      *    "reason":"You've been logged out by the server. Please log in again.",
//      *    "message":"You've been logged out by the server. Please log in again. [403]",
//      *    "errorType":"Meteor.Error"
//      *   }
//      * }
//      * */
//     if (data.error?.error === 403 && !isAuthRefreshing) {
//       isAuthRefreshing = true;
//       refreshAuthTokens().then(success => {
//         console.log('retry success:', success);
//         if (!success) {
//           messageQueue = [];
//           isAuthRefreshing = false;
//           return;
//         }
//         setupAuthInfo();
//
//         // handle retry
//         const messageNeedRetry = messageQueue.filter(item => {
//           return item.id === data.id;
//         });
//         messageNeedRetry.forEach(message => {
//           sendMessage(message);
//         });
//
//         messageQueue = [];
//         isAuthRefreshing = false;
//       });
//
//       return;
//     }
//     _.remove(messageQueue, function (item) {
//       return item.id === data.id;
//     });
//   };
//
//   const setupAuthInfo = () => {
//     const {accessToken} = getChatAuthInfo();
//     rocketChatAuthToken = accessToken;
//   };
//
//   const setupSocket = () => {
//     setupAuthInfo();
//
//     if (!socket) {
//       return;
//     }
//
//     socket.onopen = onOpen;
//     socket.onclose = onClose;
//     socket.onmessage = (event: WebSocketMessageEvent) => {
//       onMessageMustHave(event);
//       onMessage && onMessage(event);
//     };
//     // @ts-ignore
//     socket.onerror = onError;
//   };
//
//   setupSocket();
//
//   useEffect(() => {
//     if (waitingToReconnect) {
//       return;
//     }
//
//     console.log('useEffect');
//     socket = new WebSocket(
//       'wss://rockettest.bein.group/websocket' || Config.SOCKET_ROCKET_CHAT,
//     );
//     setupSocket();
//     setTimeout(() => setWaitingToReconnect(false), 500);
//
//     return () => {
//       socket && socket.close();
//     };
//   }, [waitingToReconnect]);
//   return {socket, closeConnect, sendMessage};
// };
//
// export default useSocketChat;
