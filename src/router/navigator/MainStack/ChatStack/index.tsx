import React from 'react';
import {useDispatch} from 'react-redux';

import stack from './stack';
import screens from './screens';
import BaseStackNavigator from '~/router/components/BaseStackNavigator';
import actions from '~/screens/Chat/redux/actions';
import {addOnMessageCallback, sendMessage} from '~/services/chatSocket';
import {chatSocketId} from '~/constants/chat';

const ChatStack = (): React.ReactElement => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const removeOnMessageCallback = addOnMessageCallback(
      'callback-of-list-chat-screen',
      event => {
        dispatch(actions.handleEvent(JSON.parse(event.data)));
      },
    );

    subscribeRoomsMessages();

    return () => {
      removeOnMessageCallback();
      unsubscribeRoomsMessages();
    };
  }, []);

  const subscribeRoomsMessages = () => {
    sendMessage({
      msg: 'sub',
      id: chatSocketId.SUBSCRIBE_ROOMS_MESSAGES,
      name: 'stream-room-messages',
      params: ['__my_messages__', false],
    });
  };

  const unsubscribeRoomsMessages = () => {
    sendMessage({
      msg: 'unsub',
      id: chatSocketId.SUBSCRIBE_ROOMS_MESSAGES,
    });
  };

  return <BaseStackNavigator stack={stack} screens={screens} />;
};

export default ChatStack;
