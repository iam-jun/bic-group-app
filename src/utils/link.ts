import {getEnv} from '~/utils/env';

const LINK_POST = 'LINK_POST';
const LINK_GROUP = 'LINK_GROUP';
const LINK_CHAT_MESSAGE = 'LINK_CHAT_MESSAGE';

const formatParams = (params?: any) => {
  if (typeof params !== 'object') {
    return '';
  }
  const keys = Object.keys(params);
  let result = '';
  if (keys.length > 0) {
    keys.forEach((item: string) => {
      result += item + '=' + params[item];
    });
    return '?' + result;
  }
};

const getLink = (linkType: string, id?: string, params?: any): string => {
  switch (linkType) {
    case LINK_POST:
      return getEnv('SELF_DOMAIN') + '/post/t/' + id + formatParams(params);
    case LINK_CHAT_MESSAGE:
      return getEnv('SELF_DOMAIN') + '/chat/' + id + formatParams(params);
    case LINK_GROUP:
      return getEnv('SELF_DOMAIN') + '/groups/' + id + formatParams(params);
    default:
      return '';
  }
};

export {LINK_CHAT_MESSAGE, LINK_POST, LINK_GROUP, getLink};
