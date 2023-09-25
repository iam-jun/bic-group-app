import { PostType } from '~/interfaces/IPost';
import { AttributeFeed, ContentFeed, ScheduledFeed } from '~/interfaces/IFeed';

export const getParamsContentFeed = (contentFilter: ContentFeed | ScheduledFeed) => {
  switch (contentFilter) {
    case ContentFeed.ALL:
      return undefined;
    case ContentFeed.ARTICLE:
      return PostType.ARTICLE;
    case ContentFeed.POST:
      return PostType.POST;
    case ContentFeed.SERIES:
      return PostType.SERIES;
  }
};

export const isFilterWithThisAttributeFeed = (
  currentAttributeFeedFilter: AttributeFeed,
  attributeFeed: AttributeFeed,
) => {
  if (currentAttributeFeedFilter === attributeFeed) return true;
  return undefined;
};
