import videoParser from 'js-video-url-parser';
import { EmbedUrlData } from './components/EmbedVideo';

export const getVideoExtention = (url: any) => {
  let ext = null;
  if (typeof url === 'string') {
    // eslint-disable-next-line no-bitwise
    ext = url.slice((url.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  return ext || 'm3u8';
};

const YOUTUBE_PREFIX = 'https://www.youtube.com/embed/';
const VIMEO_PREFIX = 'https://player.vimeo.com/video/';
const DAILYMOTION_PREFIX = 'https://www.dailymotion.com/embed/video/';
const YOUKU_PREFIX = 'https://player.youku.com/embed/';
const COUB_PREFIX = 'https://coub.com/embed/';

export const parseVideoUrl = (url: string): EmbedUrlData | undefined => {
  const videoData = videoParser.parse(url);
  if (videoData?.provider && videoData.id) {
    const { id, provider } = videoData;

    const providerUrls: Record<string, string> = {
      youtube: `${YOUTUBE_PREFIX}${id}`,
      vimeo: `${VIMEO_PREFIX}${id}`,
      dailymotion: `${DAILYMOTION_PREFIX}${id}`,
      youku: `${YOUKU_PREFIX}${id}`,
      coub: `${COUB_PREFIX}${id}`,
    };

    return {
      id,
      provider,
      url: providerUrls[provider],
    };
  }
};

export const getAutoplayUrl = (url: string) => {
  const autoplayParam = 'autoplay=';
  // already autoplay
  if (url.includes(`${autoplayParam}1`)) return url;
  if (url.includes(`${autoplayParam}0`)) return url.replace(`${autoplayParam}0`, `${autoplayParam}1`);

  if (url.includes('?')) {
    return `${url}&${autoplayParam}1`;
  }

  return `${url}?${autoplayParam}1`;
};
