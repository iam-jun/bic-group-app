import { linkRegex } from '~/constants/commonRegex';

export function timeOut(ms = 100) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
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
      console.error(
        '\x1b[35m🐣️ common parseSafe: ', e, '\x1b[0m',
      );
    }
  }
  return result;
}

export const getUrlFromText = (text = '', inputArray = []) => {
  if (!text) return inputArray;
  const urls = text.match(linkRegex);
  if (urls && urls.length > 0) {
    const newArray = [...inputArray];
    newArray.push(urls[0]);
    const newText = text.replace(urls[0], '');
    return getUrlFromText(newText, newArray);
  }
  return inputArray;
};

export const searchText = (
  keyword: string, text: string,
):boolean => {
  if (!text) return false;

  const newTextWithoutVietnamese = nonAccentVietnamese(text);
  const newKeywordWithoutVietnamese = nonAccentVietnamese(keyword);

  return newTextWithoutVietnamese.includes(newKeywordWithoutVietnamese);
};

const nonAccentVietnamese = (str: string) => {
  let text = str.toLowerCase();

  text = text.replace(
    /à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a',
  );
  text = text.replace(
    /è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e',
  );
  text = text.replace(
    /ì|í|ị|ỉ|ĩ/g, 'i',
  );
  text = text.replace(
    /ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o',
  );
  text = text.replace(
    /ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u',
  );
  text = text.replace(
    /ỳ|ý|ỵ|ỷ|ỹ/g, 'y',
  );
  text = text.replace(
    /đ/g, 'd',
  );
  // Some system encode vietnamese combining accent as individual utf-8 characters
  text = text.replace(
    /\u0300|\u0301|\u0303|\u0309|\u0323/g, '',
  ); // Huyền sắc hỏi ngã nặng
  text = text.replace(
    /\u02C6|\u0306|\u031B/g, '',
  ); // Â, Ê, Ă, Ơ, Ư
  return text;
};
