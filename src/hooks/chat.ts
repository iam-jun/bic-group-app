import {useSelector} from 'react-redux';
import {getConversations} from '~/selectors/chat';
import {useKeySelector} from './selector';

const useChat = () => {
  const chat = useKeySelector('chat');
  const conversations = useSelector(state => getConversations(state));

  return {...chat, conversations};
};

export default useChat;
