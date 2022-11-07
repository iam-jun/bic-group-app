import { POST_TYPE } from '~/interfaces/IPost';
import { ATTRIBUTE_FEED, CONTENT_FEED } from './Interface';

export const getParamsContentFeed = (contentFilter: CONTENT_FEED) => {
  switch (contentFilter) {
    case CONTENT_FEED.ALL: return undefined;
    case CONTENT_FEED.ARTICLE: return POST_TYPE.ARTICLE;
    case CONTENT_FEED.POST: return POST_TYPE.POST;
    case CONTENT_FEED.SERIES: return POST_TYPE.SERIES;
  }
};

export const getParamsAttributeFeed = (attributeFilter: ATTRIBUTE_FEED) => {
  if (attributeFilter === ATTRIBUTE_FEED.ALL) return false;
  return true;
};
