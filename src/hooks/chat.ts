import {useSelector} from 'react-redux';
import {IObject} from '~/interfaces/common';

const useChat = () => {
  const chat = useSelector((state: IObject<any>) => state.chat);
  return chat;
};

export default useChat;
