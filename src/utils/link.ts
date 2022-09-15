import { Linking } from 'react-native';
import { chatSchemes } from '~/constants/chat';
import {
  BIC_GROUP_DOMAINS,
  PREFIX_DEEPLINK_GROUP, PREFIX_HTTPS,
} from '~/router/config';
import getEnv from '~/utils/env';
import { getWebDomain } from './common';
import ConvertHelper from './convertHelper';

const LINK_POST = 'LINK_POST';
const LINK_COMMENT = 'LINK_COMMENT';
const LINK_COMMUNITY = 'LINK_COMMUNITY';

const UUID_V4_PATTERN = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

export const DEEP_LINK_TYPES = {
  POST_DETAIL: 'post-detail',
  COMMENT_DETAIL: 'comment-detail',
  COMMUNTY_DETAIL: 'community-detail',
  GROUP_DETAIL: 'group-detail',
};

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

  // convert params to snake_case to have the same format as web
  const paramsInSnakeCase = ConvertHelper.decamelizeKeys(params);
  const keys = Object.keys(paramsInSnakeCase);
  let result = '';
  if (keys.length > 0) {
    keys.forEach((item: string, index: number) => {
      if (paramsInSnakeCase[item]) {
        result += `${(index ? '&' : '') + item}=${paramsInSnakeCase[item]}`;
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
      return `${PREFIX_HTTPS}${getEnv('SELF_DOMAIN')}/posts/${id}${formatParams(params)}`;
    case LINK_COMMENT:
      return `${PREFIX_HTTPS}${getEnv('SELF_DOMAIN')}/posts/${id}${formatParamsVer2(params)}`;
    case LINK_COMMUNITY:
      return `${PREFIX_HTTPS}${getEnv('SELF_DOMAIN')}/communities/${id}${formatParams(params)}`;
    default:
      return '';
  }
};

const getGroupLink = ({
  communityId, groupId, params,
}: {
  communityId: string; groupId: string; params?: any
}) => `${PREFIX_HTTPS}${getEnv('SELF_DOMAIN')}/communities/${communityId}/groups/${groupId}${formatParams(params)}`;

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

const validateBICGroupDomain = (url: string) => {
  if (!url) return false;

  return Object.values(BIC_GROUP_DOMAINS).some((domain: string) => url.startsWith(domain));
};

export function openUrl(url: string, onError?: (e: any) => void, onSuccess?: (e: any) => void) {
  const selfDomain = getEnv('SELF_DOMAIN');
  const isBICGroupDomain = validateBICGroupDomain(url);

  if (isBICGroupDomain) {
    const selfDomainPosition = url.indexOf(selfDomain);
    const deepLinkUrl = PREFIX_DEEPLINK_GROUP + url.substring(selfDomainPosition).replace(selfDomain, '');

    Linking.canOpenURL(deepLinkUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(deepLinkUrl).then(onSuccess).catch(onError);
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

export const matchDeepLink = (url: string) => {
  if (!url) return null;

  // bic:///posts/99ca53ec-5195-4e28-9506-c0f602e1becb
  let match = new RegExp(
    `^${PREFIX_DEEPLINK_GROUP}\\/posts\\/(${UUID_V4_PATTERN})$`,
  ).exec(url);
  if (match) {
    const postId = match[1];
    return { type: DEEP_LINK_TYPES.POST_DETAIL, id: postId };
  }

  // bic:///posts/99ca53ec-5195-4e28-9506-c0f602e1becb?commentId=690541f1-d7ae-4f73-8186-8194c5e2eb5f
  match = new RegExp(
    `^${PREFIX_DEEPLINK_GROUP}\\/posts\\/(${UUID_V4_PATTERN})\\?(\\S+)$`,
  ).exec(url);
  if (match) {
    const postId = match[1];
    const urlParams = match[2];
    const newParams = getURLParams(urlParams);
    return { type: DEEP_LINK_TYPES.COMMENT_DETAIL, id: postId, params: newParams };
  }

  // bic:///communities/ba6016d4-168f-44de-aca9-4a51055e6201
  match = new RegExp(
    `^${PREFIX_DEEPLINK_GROUP}\\/communities\\/(${UUID_V4_PATTERN})$`,
  ).exec(url);
  if (match) {
    const communityId = match[1];
    return { type: DEEP_LINK_TYPES.COMMUNTY_DETAIL, id: communityId };
  }

  // bic:///communities/ba6016d4-168f-44de-aca9-4a51055e6201/groups/5578fb11-de70-49e3-9c01-27e26f5b42d8
  match = new RegExp(
    `^${PREFIX_DEEPLINK_GROUP}\\/communities\\/(${UUID_V4_PATTERN})\\/groups\\/(${UUID_V4_PATTERN})$`,
  ).exec(url);
  if (match) {
    const groupId = match[2];
    return { type: DEEP_LINK_TYPES.GROUP_DETAIL, id: groupId };
  }

  return null;
};

export const getURLParams = (params: string) => {
  const newParams = params.split('&')
    ?.map((item) => item.split('='))
    ?.reduce((p, c) => {
      if (c.length > 1) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line prefer-destructuring
        p[c[0]] = c[1];
      }
      return p;
    }, {});

  // need to convert to camelCase since the input params are in snake_case
  return ConvertHelper.camelizeKeys(newParams) as Object;
};
