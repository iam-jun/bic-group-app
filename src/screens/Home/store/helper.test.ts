import { AttributeFeed, ContentFeed } from '~/interfaces/IFeed';
import { PostType } from '~/interfaces/IPost';
import { getParamsContentFeed, isFilterWithThisAttributeFeed } from './helper';

describe('helper in home store', () => {
  describe('getParamsContentFeed function', () => {
    it('given contentFilter = ContentFeed.ALL should return undefined', () => {
      expect(getParamsContentFeed(ContentFeed.ALL)).toBeUndefined();
    });

    it('given contentFilter = ContentFeed.ARTICLE should return PostType.ARTICLE', () => {
      expect(getParamsContentFeed(ContentFeed.ARTICLE)).toBe(PostType.ARTICLE);
    });

    it('given contentFilter = ContentFeed.POST should return PostType.POST', () => {
      expect(getParamsContentFeed(ContentFeed.POST)).toBe(PostType.POST);
    });

    it('given contentFilter = ContentFeed.SERIES should return PostType.SERIES', () => {
      expect(getParamsContentFeed(ContentFeed.SERIES)).toBe(PostType.SERIES);
    });
  });

  describe('isFilterWithThisAttributeFeed function', () => {
    it('given currentAttributeFeedFilter and arbitrary attributeFeed should return true if currentAttributeFeedFilter is expected attributeFeed', () => {
      expect(
        isFilterWithThisAttributeFeed(AttributeFeed.MINE, AttributeFeed.MINE),
      ).toBeTruthy();
    });

    it('given currentAttributeFeedFilter and arbitrary attributeFeed should return false if currentAttributeFeedFilter is not expected attributeFeed', () => {
      expect(
        isFilterWithThisAttributeFeed(
          AttributeFeed.MINE,
          AttributeFeed.IMPORTANT,
        ),
      ).toBeFalsy();
    });
  });
});
