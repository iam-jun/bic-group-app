import {useSelector} from 'react-redux';
import {useKeySelector} from './selector';
import {getConversations, getMessages} from '~/selectors/chat';

const useChat = () => {
  const chat = useKeySelector('chat');
  const conversations = useSelector(state => getConversations(state));
  const messages = useSelector(state => getMessages(state));
  return {...chat, conversations, messages};
};

export default useChat;
