import {useSelector} from 'react-redux';
import {useKeySelector} from './selector';
import {
  getConversations,
  getMessages,
  getUnreadMessagePosition,
} from '~/selectors/chat';

const useChat = () => {
  const chat = useKeySelector('chat');
  const conversations = useSelector(state => getConversations(state));
  const messages = useSelector(state => getMessages(state));
  const unreadMessagePosition = useSelector(state =>
    getUnreadMessagePosition(state),
  );
  return {...chat, conversations, messages, unreadMessagePosition};
};

export default useChat;
