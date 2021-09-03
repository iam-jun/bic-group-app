import {useSelector} from 'react-redux';
import {getConversations, getMessages} from '~/selectors/chat';

const useChat = () => {
  const chat = useSelector((state: any) => state.chat);
  const conversations = useSelector(state => getConversations(state));
  const messages = useSelector(state => getMessages(state));
  return {...chat, conversations, messages};
};

export default useChat;
