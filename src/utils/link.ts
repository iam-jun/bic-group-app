import { Linking } from 'react-native';
import { chatSchemes } from '~/constants/chat';
import { PREFIX_DEEPLINK_GROUP } from '~/hooks/navigationLinking';
import getEnv from '~/utils/env';
import { getWebDomain } from './common';

const LINK_POST = 'LINK_POST';
const LINK_COMMENT = 'LINK_COMMENT';
const LINK_COMMUNITY = 'LINK_COMMUNITY';

const formatParams = (params?: any):string => {
  if (typeof params !== 'object') {
    return '';
  }
  const keys = Object.keys(params);
  let result = '';
  if (keys.length > 0) {
    keys.forEach((item: string) => {
      result += `${item}=${params[item]}`;
    });
    return `?${result}`;
  }
  return result;
};

const formatParamsVer2 = (params?: any) : string => {
  if (typeof params !== 'object') {
    return '';
  }
  const keys = Object.keys(params);
  let result = '';
  if (keys.length > 0) {
    keys.forEach((
      item: string, index: number,
    ) => {
      if (params[item]) {
        result += `${(index ? '&' : '') + item}=${params[item]}`;
      }
    });
    return `?${result}`;
  }
  return result;
};

const getLink = (
  linkType: string, id?: string, params?: any,
): string => {
  switch (linkType) {
    case LINK_POST:
      return `${getEnv('SELF_DOMAIN')}/posts/${id}${formatParams(params)}`;
    case LINK_COMMENT:
      return `${getEnv('SELF_DOMAIN')}/posts/${id}${formatParamsVer2(params)}`;
    case LINK_COMMUNITY:
      return `${getEnv('SELF_DOMAIN')}/communities/${id}${formatParams(params)}`;
    default:
      return '';
  }
};

const getGroupLink = ({
  communityId, groupId, params,
}: {
  communityId: string; groupId: string; params?: any
}) => `${getEnv('SELF_DOMAIN')}/communities/${communityId}/groups/${groupId}${formatParams(params)}`;

export {
  LINK_POST, LINK_COMMENT, LINK_COMMUNITY, getLink, getGroupLink,
};

export const getChatDomain = () => (
  chatSchemes.PREFIX_HTTPS
    + getWebDomain(
      getEnv('BEIN_CHAT_DEEPLINK').replace(
        chatSchemes.PREFIX_DEEPLINK,
        chatSchemes.PREFIX_HTTPS,
      ),
      true,
    )
);

export const formatChannelLink = (
  teamId: string, channel: string,
) => `${getEnv('BEIN_CHAT_DEEPLINK')}${teamId}/channels/${channel}`;

export const formatDMLink = (
  teamId: string, username: string,
) => `${getEnv('BEIN_CHAT_DEEPLINK')}${teamId}/messages/@${username}`;

export function openUrl(url: string, onError?: (e: any)=> void, onSuccess?: (e: any)=> void) {
  // handle url from BIC web to have the same domain format as mobile
  const urlWithoutWww = url.replace(/(https?:\/\/)?(www.)?/i, 'http://');
  if (urlWithoutWww.includes(getEnv('SELF_DOMAIN'))) {
    const newUrl = urlWithoutWww.replace(getEnv('SELF_DOMAIN'), PREFIX_DEEPLINK_GROUP);
    Linking.canOpenURL(newUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(newUrl).then(onSuccess).catch(onError);
        } else {
          Linking.openURL(url).then(onSuccess).catch(onError);
        }
      })
      .catch((e) => {
        console.error('error when open link:', e);
      });
    return;
  }
  Linking.openURL(url).then(onSuccess).catch(onError);
}
