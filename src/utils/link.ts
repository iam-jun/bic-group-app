import {chatSchemes} from '~/constants/chat';
import {getEnv} from '~/utils/env';
import {getWebDomain} from './common';

const LINK_POST = 'LINK_POST';
const LINK_GROUP = 'LINK_GROUP';
const LINK_COMMENT = 'LINK_COMMENT';

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

const formatParamsVer2 = (params?: any) => {
  if (typeof params !== 'object') {
    return '';
  }
  const keys = Object.keys(params);
  let result = '';
  if (keys.length > 0) {
    keys.forEach((item: string, index: number) => {
      if (!!params[item]) {
        result += (index ? '&' : '') + item + '=' + params[item];
      }
    });
    return '?' + result;
  }
};

const getLink = (
  linkType: string,
  id?: number | string,
  params?: any,
): string => {
  switch (linkType) {
    case LINK_POST:
      return getEnv('SELF_DOMAIN') + '/posts/' + id + formatParams(params);
    case LINK_COMMENT:
      return getEnv('SELF_DOMAIN') + '/posts/' + id + formatParamsVer2(params);
    case LINK_GROUP:
      return getEnv('SELF_DOMAIN') + '/groups/' + id + formatParams(params);
    default:
      return '';
  }
};

export {LINK_POST, LINK_GROUP, LINK_COMMENT, getLink};

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

export const formatChannelLink = (teamId: string, channel: string) => {
  return `${getEnv('BEIN_CHAT_DEEPLINK')}${teamId}/channels/${channel}`;
};

export const formatDMLink = (teamId: string, username: string) => {
  return `${getEnv('BEIN_CHAT_DEEPLINK')}${teamId}/messages/@${username}`;
};
