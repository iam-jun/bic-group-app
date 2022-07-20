import { Linking } from 'react-native';
import { linkRegex } from '~/constants/commonRegex';

export const generateAvatar = (name?: string, color?: string) => `https://ui-avatars.com/api/?name=${
  name?.toUpperCase() || ''
}&background=${color || '4c95ff'}&color=fff&size=128`;

export const openLink = async (link: string) => {
  const supported = await Linking.canOpenURL(link);
  if (supported) {
    await Linking.openURL(link);
  } else {
    console.error('\x1b[31m', `🐣️ openLink : cant open url ${link}`, '\x1b[0m');
  }
};

export function timeOut(ms?: number) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms || 100));
}

export function titleCase(str: string | undefined) {
  if (!str) return str;
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}

export function parseSafe(str?: string) {
  let result;
  if (typeof str === 'object') {
    return str;
  }
  if (str) {
    try {
      result = JSON.parse(str);
    } catch (e) {
      console.error('\x1b[35m🐣️ common parseSafe: ', e, '\x1b[0m');
    }
  }
  return result;
}

export const getUrlFromText = (text?: string) => {
  if (!text) return text;
  const urls = text.match(linkRegex);

  if (urls && urls.length > 0) return urls[0];
  return null;
};

export const searchText = (keyword: string, text: string):boolean => {
  if (!text) return false;

  const newTextWithoutVietnamese = nonAccentVietnamese(text);
  const newKeywordWithoutVietnamese = nonAccentVietnamese(keyword);

  return newTextWithoutVietnamese.includes(newKeywordWithoutVietnamese);
};

export const nonAccentVietnamese = (str: string) => {
  let text = str.toLowerCase();

  text = text.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  text = text.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  text = text.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  text = text.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  text = text.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  text = text.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  text = text.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  text = text.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  text = text.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return text;
};

export const getWebDomain = (_url: any, _subdomain: boolean) => {
  const subdomain = _subdomain || false;

  let url = _url.replace(/(https?:\/\/)?(www.)?/i, '');

  if (!subdomain) {
    url = url.split('.');

    url = url.slice(url.length - 2).join('.');
  }

  if (url.indexOf('/') !== -1) {
    return url.split('/')[0];
  }

  return url;
};
/** NOTE: do not use this function for our app bc we handle special case
 * in socket event and when have any response from BE */
// /**
//  * all data from backend send to client must be snake_case
//  * so we have to convert it to camelCase for use in client's code
//  * @param key
//  */
// export const convertReactKeyFromResponse = (key?: string) => {
//   return key ? camelize(key) : '';
// };

// /**
//  * before send react key to backend, we must convert it back to snake_case
//  * @param key
//  */
// export const convertReactKeyForRequest = (key?: string) => {
//   return key ? decamelize(key) : '';
// };
