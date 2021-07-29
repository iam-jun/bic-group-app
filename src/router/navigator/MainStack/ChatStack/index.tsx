import React from 'react';
import {useDispatch} from 'react-redux';

import stack from './stack';
import screens from './screens';
import BaseStackNavigator from '~/router/components/BaseStackNavigator';
import actions from '~/screens/Chat/redux/actions';
import {addOnMessageCallback} from '~/services/chatSocket';

const ChatStack = (): React.ReactElement => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const removeOnMessageCallback = addOnMessageCallback(
      'callback-of-list-chat-screen',
      event => {
        dispatch(actions.handleEvent(JSON.parse(event.data)));
      },
    );

    return () => {
      removeOnMessageCallback();
    };
  }, []);

  return <BaseStackNavigator stack={stack} screens={screens} />;
};

export default ChatStack;
