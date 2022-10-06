import { Linking } from 'react-native';
import  getEnv  from '~/utils/env';
import { CURRENT_SERVER, DeepLinkTypes, Files } from './config';
import { latinise } from './latinise.js';

export function escapeRegex(text) {
  return text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

const ytRegex = /(?:http|https):\/\/(?:www\.|m\.)?(?:(?:youtube\.com\/(?:(?:v\/)|(?:(?:watch|embed\/watch)(?:\/|.*v=))|(?:embed\/)|(?:user\/[^/]+\/u\/[0-9]\/)))|(?:youtu\.be\/))([^#&?]*)/;

export function isValidUrl(url = '') {
  const regex = /^https?:\/\//i;
  return regex.test(url);
}

export function stripTrailingSlashes(url = '') {
  return url.replace(/ /g, '').replace(/^\/+/, '').replace(/\/+$/, '');
}

export function removeProtocol(url = '') {
  return url.replace(/(^\w+:|^)\/\//, '');
}

export function isImageLink(link) {
  let linkWithoutQuery = link;
  if (link.indexOf('?') !== -1) {
    linkWithoutQuery = linkWithoutQuery.split('?')[0];
  }

  for (let i = 0; i < Files.IMAGE_TYPES.length; i++) {
    const imageType = Files.IMAGE_TYPES[i];

    if (
      linkWithoutQuery.endsWith(`.${imageType}`)
      || linkWithoutQuery.endsWith(`=${imageType}`)
    ) {
      return true;
    }
  }

  return false;
}

// Converts the protocol of a link (eg. http, ftp) to be lower case since
// Android doesn't handle uppercase links.
export function normalizeProtocol(url) {
  const index = url.indexOf(':');
  if (index === -1) {
    // There's no protocol on the link to be normalized
    return url;
  }

  const protocol = url.substring(0, index);
  return protocol.toLowerCase() + url.substring(index);
}

export function cleanUpUrlable(input) {
  let cleaned = latinise(input);
  cleaned = cleaned
    .trim()
    .replace(/-/g, ' ')
    .replace(/[^\w\s]/gi, '')
    .toLowerCase()
    .replace(/\s/g, '-');
  cleaned = cleaned.replace(/-{2,}/, '-');
  cleaned = cleaned.replace(/^-+/, '');
  cleaned = cleaned.replace(/-+$/, '');
  return cleaned;
}

export function getScheme(url) {
  const match = /([a-z0-9+.-]+):/i.exec(url);

  return match && match[1];
}

export const PERMALINK_GENERIC_TEAM_NAME_REDIRECT = '_redirect';

export function matchDeepLink(url, serverURL, siteURL) {
  if (!url || (!serverURL && !siteURL)) {
    return null;
  }

  let urlToMatch = url;

  // If url doesn't contain site or server URL, tack it on.
  // e.g. <jump to convo> URLs from autolink plugin.
  const urlBase = serverURL || siteURL;
  let match = new RegExp(escapeRegex(urlBase)).exec(url);
  if (!match) {
    urlToMatch = urlBase + url;
  }

  const urlBaseWithoutProtocol = removeProtocol(urlBase);

  const linkRoot = `(?:${escapeRegex(urlBaseWithoutProtocol)})`;

  match = new RegExp(`${linkRoot}\\/([^\\/]+)\\/channels\\/(\\S+)`).exec(
    urlToMatch,
  );

  if (match) {
    return {
      type: DeepLinkTypes.CHANNEL,
      teamName: match[1],
      channelName: match[2],
    };
  }

  match = new RegExp(`${linkRoot}\\/([^\\/]+)\\/pl\\/(\\w+)`).exec(urlToMatch);
  if (match) {
    return {
      type: DeepLinkTypes.PERMALINK,
      teamName: match[1],
      postId: match[2],
    };
  }

  match = new RegExp(`${linkRoot}\\/([^\\/]+)\\/messages\\/@(\\S+)`).exec(
    urlToMatch,
  );
  if (match) {
    return {
      type: DeepLinkTypes.DMCHANNEL,
      teamName: match[1],
      userName: match[2],
    };
  }

  match = new RegExp(`${linkRoot}\\/([^\\/]+)\\/messages\\/(\\S+)`).exec(
    urlToMatch,
  );
  if (match) {
    return { type: DeepLinkTypes.GROUPCHANNEL, teamName: match[1], id: match[2] };
  }

  match = new RegExp(`${linkRoot}\\/plugins\\/([^\\/]+)\\/(\\S+)`).exec(
    urlToMatch,
  );
  if (match) {
    return { type: DeepLinkTypes.PLUGIN, id: match[1] };
  }

  return null;
}

export async function getURLAndMatch(href, serverURL, siteURL) {
  const url = normalizeProtocol(href);

  if (!url) {
    return {};
  }

  let serverUrl = serverURL;
  if (!serverUrl) {
    serverUrl = CURRENT_SERVER;
  }

  const match = matchDeepLink(url, serverURL, siteURL);

  return { url, match };
}
