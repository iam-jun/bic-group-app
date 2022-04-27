import {chatSchemes} from '~/constants/chat';
import {getEnv} from '~/utils/env';
import {getWebDomain} from './common';

const LINK_POST = 'LINK_POST';
const LINK_GROUP = 'LINK_GROUP';

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

const getLink = (linkType: string, id?: number, params?: any): string => {
  switch (linkType) {
    case LINK_POST:
      return getEnv('SELF_DOMAIN') + '/post/t/' + id + formatParams(params);
    case LINK_GROUP:
      return getEnv('SELF_DOMAIN') + '/groups/' + id + formatParams(params);
    default:
      return '';
  }
};

export {LINK_POST, LINK_GROUP, getLink};

export const getChatDomain = () => {
  return (
    chatSchemes.PREFIX_HTTPS +
    getWebDomain(
      getEnv('BEIN_CHAT_DEEPLINK').replace(
        chatSchemes.PREFIX_DEEPLINK,
        chatSchemes.PREFIX_HTTPS,
      ),
      true,
    )
  );
};
