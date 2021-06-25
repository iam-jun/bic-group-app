import Chat from '~/screens/Chat';
import Channel from './Channel';
import Message from './Message';

const loadings: {[key: string]: any} = {
  channel: Channel,
  chat: Chat,
  message: Message,
};

export default loadings;
