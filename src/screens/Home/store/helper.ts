import { POST_TYPE } from '~/interfaces/IPost';
import { AttributeFeed, ContentFeed } from './Interface';

export const getParamsContentFeed = (contentFilter: ContentFeed) => {
  switch (contentFilter) {
    case ContentFeed.ALL: return undefined;
    case ContentFeed.ARTICLE: return POST_TYPE.ARTICLE;
    case ContentFeed.POST: return POST_TYPE.POST;
    case ContentFeed.SERIES: return POST_TYPE.SERIES;
  }
};

export const getParamsAttributeFeed = (attributeFilter: AttributeFeed) => {
  if (attributeFilter === AttributeFeed.ALL) return false;
  return true;
};
