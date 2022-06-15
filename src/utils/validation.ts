// Sample get link
// const urls = detectAndGetUrls(text);
// if (urls && urls.length > 0) {
// }

// TODO: use for detect link and show UI of preview link with data from BE API
export const detectAndGetUrls = (text: string) => {
  const regexp =
    /(?:(?=[\s`!()\[\]{};:'".,<>?«»“”‘’])|\b)((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/|[a-z0-9.\-]+[.](?:com|org|net))(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))*(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]|\b))/gi;
  const urls = text.match(regexp);
  const result: string[] = [];

  if (urls && urls.length) {
    urls.forEach((url: string) => {
      if (url.toLowerCase().indexOf('http') === 0) {
        result.push(url);
      } else {
        result.push(`http://${url}`);
      }
    });
  }
  return result;
};
