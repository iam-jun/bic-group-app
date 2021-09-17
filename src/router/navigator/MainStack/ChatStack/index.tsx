import React from 'react';
import BaseStackNavigator from '~/router/components/BaseStackNavigator';
import screens from './screens';

import stack from './stack';

const ChatStack = (): React.ReactElement => {
  // const dispatch = useDispatch();

  // React.useEffect(() => {
  //   const removeOnMessageCallback = addOnMessageCallback(
  //     'callback-of-list-chat-screen',
  //     event => {
  //       dispatch(actions.handleEvent(JSON.parse(event.data)));
  //     },
  //   );
  //
  //   subscribeRoomsMessages();
  //
  //   return () => {
  //     removeOnMessageCallback();
  //     unsubscribeRoomsMessages();
  //   };
  // }, []);
  //
  // const subscribeRoomsMessages = () => {
  //   sendMessage({
  //     msg: 'sub',
  //     id: chatSocketId.SUBSCRIBE_ROOMS_MESSAGES,
  //     name: 'stream-room-messages',
  //     params: ['__my_messages__', false],
  //   });
  //   sendMessage({
  //     msg: 'sub',
  //     id: chatSocketId.SUBSCRIBE_ROOMS_MESSAGES,
  //     name: 'stream-notify-user',
  //   });
  // };
  //
  // const unsubscribeRoomsMessages = () => {
  //   sendMessage({
  //     msg: 'unsub',
  //     id: chatSocketId.SUBSCRIBE_ROOMS_MESSAGES,
  //   });
  // };

  return <BaseStackNavigator stack={stack} screens={screens} />;
};

export default ChatStack;
