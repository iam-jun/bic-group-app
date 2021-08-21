import {useSelector} from 'react-redux';
import {getUnreadConversationCount} from '~/selectors/chat';

const useTabBadge = () => {
  const chat = useSelector(state => getUnreadConversationCount(state));

  return {
    chat,
  };
};

export default useTabBadge;
