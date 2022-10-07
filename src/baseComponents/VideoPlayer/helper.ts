export const getVideoExtention = (url: any) => {
  let ext = null;
  if (typeof url === 'string') {
    // eslint-disable-next-line no-bitwise
    ext = url.slice((url.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  return ext || 'm3u8';
};
