import { PostType } from '~/interfaces/IPost';
import { AttributeFeed, ContentFeed } from './Interface';

export const getParamsContentFeed = (contentFilter: ContentFeed) => {
  switch (contentFilter) {
    case ContentFeed.ALL: return undefined;
    case ContentFeed.ARTICLE: return PostType.ARTICLE;
    case ContentFeed.POST: return PostType.POST;
    case ContentFeed.SERIES: return PostType.SERIES;
  }
};

export const getParamsAttributeFeed = (attributeFilter: AttributeFeed) => {
  if (attributeFilter === AttributeFeed.ALL) return false;
  return true;
};
