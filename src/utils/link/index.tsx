import React from 'react';
import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import BrowserModal from '~/components/BrowserModal';
import { chatSchemes } from '~/constants/chat';
import { PREFIX_DEEPLINK_GROUP, PREFIX_URL } from '~/router/config';
import useModalStore from '~/store/modal';
import ConvertHelper from '~/utils/convertHelper';
import getEnv from '~/utils/env';

export const CUSTOM_META = 'const meta = document.createElement(\'meta\'); meta.setAttribute(\'content\', \'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0\'); meta.setAttribute(\'name\', \'viewport\'); document.getElementsByTagName(\'head\')[0].appendChild(meta); ';
export const USER_AGENT_DESKTOP = 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.4) Gecko/20100101 Firefox/4.0';

const UUID_V4_PATTERN = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

export enum DeepLinkTypes {
  POST_DETAIL = 'post-detail',
  COMMENT_DETAIL = 'comment-detail',
  COMMUNTY_DETAIL = 'community-detail',
  GROUP_DETAIL = 'group-detail',
  SERIES_DETAIL = 'series-detail',
  ARTICLE_DETAIL = 'article-detail',
  LOGIN = 'login',
  FORGOT_PASSWORD = 'forgot_password',
  CONFIRM_USER = 'confirm_user',
  REFERRAL = 'referral',
  USER_PROFILE = 'user_profile',
  APP = 'APP',
  DISCOVER_COMMUNITIES = 'discover-communities',
  USER_BLOCKING = 'user-blocking'
}

export enum LinkGeneratorTypes {
  POST = 'LINK_POST',
  COMMENT = 'LINK_COMMENT',
  COMMUNITY = 'LINK_COMMUNITY',
  SERIRES = 'LINK_SERIRES',
  ARTICLE = 'LINK_ARTICLE',
}

const formatParams = (params?: any):string => {
  if (!params || typeof params !== 'object') {
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
  if (!params || typeof params !== 'object') {
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

export const generateLink = (
  linkType: LinkGeneratorTypes, id = '', params = null,
): string => {
  switch (linkType) {
    case LinkGeneratorTypes.POST:
      return `${PREFIX_URL}${getEnv('SELF_DOMAIN')}/posts/${id}${formatParams(params)}`;
    case LinkGeneratorTypes.COMMENT:
      return `${PREFIX_URL}${getEnv('SELF_DOMAIN')}/posts/${id}${formatParamsVer2(params)}`;
    case LinkGeneratorTypes.COMMUNITY:
      return `${PREFIX_URL}${getEnv('SELF_DOMAIN')}/communities/${id}${formatParams(params)}`;
    case LinkGeneratorTypes.SERIRES:
      return `${PREFIX_URL}${getEnv('SELF_DOMAIN')}/series/${id}${formatParams(params)}`;
    case LinkGeneratorTypes.ARTICLE:
      return `${PREFIX_URL}${getEnv('SELF_DOMAIN')}/article/${id}${formatParams(params)}`;
    default:
      return '';
  }
};

export const getGroupLink = ({
  communityId, groupId, params,
}: {
  communityId: string; groupId: string; params?: any
}) => `${PREFIX_URL}${getEnv('SELF_DOMAIN')}/communities/${communityId}/groups/${groupId}${formatParams(params)}`;

export const getChatDomain = () => `${chatSchemes.PREFIX_HTTPS}${chatSchemes.CHAT_DOMAIN}/`;

export const formatChannelLink = (
  teamId: string, channel: string,
) => `${chatSchemes.FULL_DEEPLINK}${teamId}/channels/${channel}`;

export const formatDMLink = (
  teamId: string, username: string,
) => `${chatSchemes.FULL_DEEPLINK}${teamId}/messages/@${username}`;

export const getHostNameFromUri = (url: string, subDomain = false) => {
  if (!url) return '';

  const specialSeparator = '://';
  const newUrlWithoutScheme = url.substring(url.indexOf(specialSeparator) + specialSeparator.length)
    .replace('www.', '');

  let hostName = newUrlWithoutScheme;
  if (hostName.indexOf('/') >= 0) { hostName = newUrlWithoutScheme.substring(0, newUrlWithoutScheme.indexOf('/')); }

  if (!subDomain) {
    const domainArrays = hostName.split('.');
    hostName = domainArrays.slice(domainArrays.length - 2).join('.');
  }

  return hostName;
};

const validateBICGroupDomain = (url: string) => {
  if (!url) return false;

  const hostName = getHostNameFromUri(url, true);

  return hostName === getEnv('SELF_DOMAIN');
};

export async function openUrl(url: string, onError?: (e: any) => void, onSuccess?: () => void) {
  const selfDomain = getEnv('SELF_DOMAIN');
  const selfDomainPosition = url.indexOf(selfDomain);
  const deepLinkUrl = PREFIX_DEEPLINK_GROUP + url.substring(selfDomainPosition).replace(selfDomain, '');
  const isBICGroupDomain = validateBICGroupDomain(url);
  let urlToOpen = url;
  if (isBICGroupDomain) {
    const supported = await Linking.canOpenURL(deepLinkUrl);
    if (supported) {
      urlToOpen = deepLinkUrl;
    }
  }

  try {
    await Linking.openURL(urlToOpen);
    onSuccess?.();
  } catch (error) {
    console.error('Failed to open url:', url);
    onError?.(error);
  }
}

const getURLParams = (params: string) => {
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
  return ConvertHelper.camelizeKeys(newParams);
};

export const matchDeepLink = (url: string) => {
  if (!url) return null;

  let deepLinkUrl = url;

  const selfDomain = getEnv('SELF_DOMAIN');
  const isBICGroupDomain = validateBICGroupDomain(url);

  if (isBICGroupDomain) {
    const selfDomainPosition = url.indexOf(selfDomain);
    deepLinkUrl = PREFIX_DEEPLINK_GROUP + url.substring(selfDomainPosition).replace(selfDomain, '');
  }
  // bic:///posts/99ca53ec-5195-4e28-9506-c0f602e1becb
  let match = new RegExp(
    `^${PREFIX_DEEPLINK_GROUP}\\/(?:[a-z]{2})?\\/?posts\\/(${UUID_V4_PATTERN})$`,
  ).exec(deepLinkUrl);
  if (match) {
    return { type: DeepLinkTypes.POST_DETAIL, postId: match[1] };
  }

  // bic:///posts/99ca53ec-5195-4e28-9506-c0f602e1becb?commentId=690541f1-d7ae-4f73-8186-8194c5e2eb5f
  match = new RegExp(
    `^${PREFIX_DEEPLINK_GROUP}\\/(?:[a-z]{2})?\\/?posts\\/(${UUID_V4_PATTERN})\\?(\\S+)$`,
  ).exec(deepLinkUrl);
  if (match) {
    const urlParams = match[2];
    const newParams = getURLParams(urlParams);

    return { type: DeepLinkTypes.COMMENT_DETAIL, postId: match[1], params: newParams };
  }

  match = new RegExp(
    `^${PREFIX_DEEPLINK_GROUP}\\/(?:[a-z]{2})?\\/?article\\/(${UUID_V4_PATTERN})\\?(\\S+)$`,
  ).exec(deepLinkUrl);
  if (match) {
    const urlParams = match[2];
    const newParams = getURLParams(urlParams);
    return { type: DeepLinkTypes.COMMENT_DETAIL, postId: match[1], params: newParams };
  }

  // bic:///communities/ba6016d4-168f-44de-aca9-4a51055e6201
  match = new RegExp(
    `^${PREFIX_DEEPLINK_GROUP}\\/(?:[a-z]{2})?\\/?communities\\/(${UUID_V4_PATTERN})(?:\\/about$|\\/members$|$)`,
  ).exec(deepLinkUrl);
  if (match) {
    return { type: DeepLinkTypes.COMMUNTY_DETAIL, communityId: match[1] };
  }

  // bicdev:///communities/discover
  match = new RegExp(
    `^${PREFIX_DEEPLINK_GROUP}\\/(?:[a-z]{2})?\\/?communities\\/?discover$`,
  ).exec(deepLinkUrl);
  if (match) {
    return { type: DeepLinkTypes.DISCOVER_COMMUNITIES };
  }

  // bic:///communities/ba6016d4-168f-44de-aca9-4a51055e6201/groups/5578fb11-de70-49e3-9c01-27e26f5b42d8
  match = new RegExp(
    // eslint-disable-next-line max-len
    `^${PREFIX_DEEPLINK_GROUP}\\/(?:[a-z]{2})?\\/?communities\\/(${UUID_V4_PATTERN})\\/groups\\/(${UUID_V4_PATTERN})(?:\\/about$|\\/members$|$)`,
  ).exec(deepLinkUrl);
  if (match) {
    return { type: DeepLinkTypes.GROUP_DETAIL, communityId: match[1], groupId: match[2] };
  }

  // bic:///series/47e14e0b-ea99-4771-bf20-0f0893788a51
  match = new RegExp(
    `^${PREFIX_DEEPLINK_GROUP}\\/(?:[a-z]{2})?\\/?series\\/(${UUID_V4_PATTERN})$`,
  ).exec(deepLinkUrl);
  if (match) {
    return { type: DeepLinkTypes.SERIES_DETAIL, seriesId: match[1] };
  }

  // bic:///article/8465397a-dfb3-4d7f-a21f-adec5a0508701
  match = new RegExp(
    `^${PREFIX_DEEPLINK_GROUP}\\/(?:[a-z]{2})?\\/?article\\/(${UUID_V4_PATTERN})$`,
  ).exec(deepLinkUrl);
  if (match) {
    return { type: DeepLinkTypes.ARTICLE_DETAIL, articleId: match[1] };
  }

  match = new RegExp(
    `^${PREFIX_DEEPLINK_GROUP}\\/(?:[a-z]{2})?\\/?confirm-user\\?(\\S+)$`,
  ).exec(deepLinkUrl);
  if (match) {
    const urlParams = match[1];
    const newParams = getURLParams(urlParams);
    return { type: DeepLinkTypes.CONFIRM_USER, params: newParams };
  }

  match = new RegExp(
    `^${PREFIX_DEEPLINK_GROUP}\\/(?:[a-z]{2})?\\/?ref\\/(\\S+)$`,
  ).exec(deepLinkUrl);
  if (match) {
    return { type: DeepLinkTypes.REFERRAL, referralCode: match[1] };
  }

  match = new RegExp(
    `^${PREFIX_DEEPLINK_GROUP}\\/(?:[a-z]{2})?\\/?users\\/(\\S+)$`,
  ).exec(deepLinkUrl);
  if (match) {
    return { type: DeepLinkTypes.USER_PROFILE, userName: match[1] };
  }

  match = new RegExp(
    // follow the url from web
    `^${PREFIX_DEEPLINK_GROUP}\\/(?:[a-z]{2})?\\/?settings\\/?blocking$`,
  ).exec(deepLinkUrl);
  if (match) {
    return { type: DeepLinkTypes.USER_BLOCKING };
  }

  if (new RegExp(`^${PREFIX_DEEPLINK_GROUP}`).test(deepLinkUrl)) {
    return { type: DeepLinkTypes.APP };
  }

  return null;
};

/**
  *  This script dispatches new custom messaging event
  */
export function getInjectableJSMessage(message: any) {
  return `
    (function() {
      document.dispatchEvent(new MessageEvent('message', {
        data: ${JSON.stringify(message)}
      }));
    })();
  `;
}

export const getErrorMessageFromResponse = (response: any) => {
  if (typeof response === 'string') return response;
  if (response?.message) return response.message;

  const meta = response?.data?.meta || response?.meta || {};
  return meta?.errors?.[0]?.message || meta?.message;
};

export const openInAppBrowser = async (url) => {
  const isAvailable = await InAppBrowser.isAvailable();

  if (isAvailable) {
    await InAppBrowser.open(url);
  } else {
    useModalStore.getState().actions.showModal({
      isOpen: true,
      isFullScreen: true,
      ContentComponent: (<BrowserModal url={url} />),
    });
  }
};
