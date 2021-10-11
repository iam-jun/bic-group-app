import {getEnv} from '~/utils/env';

const LINK_POST = 'LINK_POST';
const LINK_CHAT_MESSAGE = 'LINK_CHAT_MESSAGE';

const getLink = (linkType: string, id?: string, params?: any): string => {
  switch (linkType) {
    case LINK_POST:
      return getEnv('SELF_DOMAIN') + '/post/t/' + id;
    case LINK_CHAT_MESSAGE:
      return (
        getEnv('SELF_DOMAIN') +
        '/chat/' +
        id +
        '?message_id=' +
        params?.message_id
      );
    default:
      return '';
  }
};

export {LINK_CHAT_MESSAGE, LINK_POST, getLink};
