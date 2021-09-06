import {useSelector} from 'react-redux';
import {getUnreadConversationCount} from '~/selectors/chat';
import useNotifications from '~/hooks/notifications';

const useTabBadge = () => {
  const chat = useSelector(state => getUnreadConversationCount(state));
  const {unseenNumber} = useNotifications();
  return {
    chat,
    notification: unseenNumber,
  };
};

export default useTabBadge;
