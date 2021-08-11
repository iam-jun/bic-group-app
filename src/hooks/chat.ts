import {useSelector} from 'react-redux';
import {getConversations} from '~/selectors/chat';

const useChat = () => {
  const chat = useSelector((state: any) => state.chat);
  const conversations = useSelector(state => getConversations(state));

  return {...chat, conversations};
};

export default useChat;
