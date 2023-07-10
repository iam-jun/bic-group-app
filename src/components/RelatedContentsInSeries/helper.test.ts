import { isEqual } from 'lodash';
import { seriesWithItemsResponse } from '~/test/mock_data/series';
import { getPrevAndNextContentInSeries, goToContentInseries } from './helper';
import { IPost, PostType } from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';

describe('RelatedContentsInSeries helper', () => {
  describe('getPrevAndNextContentInSeries function', () => {
    it('given a postId that is the first post in items of a series, and items.length === 1, should return prevContent === series index and nextContent === null', () => {
      const seriesResponse = seriesWithItemsResponse.data.series[0];
      const postId = seriesResponse.items[0].id;
      const series = {
        ...seriesResponse,
        items: [
          seriesResponse.items[0],
        ],
      };
      const { prevContent, nextContent } = getPrevAndNextContentInSeries(postId, series as IPost);

      expect(isEqual(prevContent, { ...series, title: 'Series Index' })).toBeTruthy();
      expect(nextContent).toBeFalsy();
    });

    it('given a postId that is the last post in items of a series should return prevContent === prev post and nextContent === series index', () => {
      const postId = seriesWithItemsResponse.data.series[0].items.at(-1).id;
      const prev = seriesWithItemsResponse.data.series[0].items.at(-2);
      const series = seriesWithItemsResponse.data.series[0];
      const { prevContent, nextContent } = getPrevAndNextContentInSeries(postId, series as IPost);

      expect(isEqual(prevContent, prev)).toBeTruthy();
      expect(isEqual(nextContent, { ...series, title: 'Series Index' })).toBeTruthy();
    });

    it('given a postId that is in items of a series should return prevContent === prev post and nextContent === next post', () => {
      const postId = seriesWithItemsResponse.data.series[0].items[1].id;
      const prev = seriesWithItemsResponse.data.series[0].items[0];
      const next = seriesWithItemsResponse.data.series[0].items[2];
      const series = seriesWithItemsResponse.data.series[0];
      const { prevContent, nextContent } = getPrevAndNextContentInSeries(postId, series as IPost);

      expect(isEqual(prevContent, prev)).toBeTruthy();
      expect(isEqual(nextContent, next)).toBeTruthy();
    });
  });

  describe('goToContentInseries function', () => {
    it('given post type === POST, should navigate to postDetail', () => {
      const post = {
        type: PostType.POST,
        id: '123',
      };
      const screenName = goToContentInseries(post);

      expect(screenName).toBe(homeStack.postDetail);
    });

    it('given post type === ARTICLE, should navigate to articleContentDetail', () => {
      const post = {
        type: PostType.ARTICLE,
        id: '123',
      };
      const screenName = goToContentInseries(post);

      expect(screenName).toBe(articleStack.articleContentDetail);
    });

    it('given post type === SERIES, should navigate to seriesDetail', () => {
      const post = {
        type: PostType.SERIES,
        id: '123',
      };
      const screenName = goToContentInseries(post);

      expect(screenName).toBe(seriesStack.seriesDetail);
    });
  });
});
