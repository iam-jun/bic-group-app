import streamApi from '~/api/StreamApi';
import { AttributeFeed, ContentFeed } from '~/interfaces/IFeed';
import { mockDataFeedResponse } from '~/test/mock_data/home';
import { act, renderHook, waitFor } from '~/test/testUtils';
import useHomeStore from '../index';

describe('getDataFeed in feed', () => {
  it('should get posts success:', async () => {
    const spyApiGetNewsfeed = jest.spyOn(streamApi, 'getNewsfeed').mockImplementation(
      () => Promise.resolve(mockDataFeedResponse) as any,
    );

    const { result } = renderHook(() => useHomeStore((state) => state));

    act(() => {
      result.current.actions.getDataFeed();
    });

    expect(spyApiGetNewsfeed).toBeCalled();

    await waitFor(() => {
      const { attributeFilter, contentFilter, feed } = result.current;
      expect(attributeFilter).toBe(AttributeFeed.ALL);
      expect(contentFilter).toBe(ContentFeed.ALL);
      expect(feed.ALL.ALL.canLoadMore).toBe(mockDataFeedResponse.meta.hasNextPage);
      expect(feed.ALL.ALL.isLoading).toBe(false);
      expect(feed.ALL.ALL.data.length).toBe(mockDataFeedResponse.list.length);
    });
  });

  it('should refresh posts success:', async () => {
    const spyApiGetNewsfeed = jest.spyOn(streamApi, 'getNewsfeed').mockImplementation(
      () => Promise.resolve(mockDataFeedResponse) as any,
    );

    const { result } = renderHook(() => useHomeStore((state) => state));

    useHomeStore.setState((state): any => ({
      ...state,
      contentFilter: ContentFeed.ALL,
      attributeFilter: AttributeFeed.ALL,
      feed: {
        [ContentFeed.ALL]: {
          [AttributeFeed.ALL]: {
            data: ['1', '2', '3', '4', '5'],
            isLoading: false,
            canLoadMore: true,
            refreshing: false,
          },
        },
      },
    }));

    act(() => {
      result.current.actions.getDataFeed(true);
    });

    expect(spyApiGetNewsfeed).toBeCalled();

    await waitFor(() => {
      const { attributeFilter, contentFilter, feed } = result.current;
      expect(attributeFilter).toBe(AttributeFeed.ALL);
      expect(contentFilter).toBe(ContentFeed.ALL);
      expect(feed.ALL.ALL.canLoadMore).toBe(mockDataFeedResponse.meta.hasNextPage);
      expect(feed.ALL.ALL.isLoading).toBe(false);
      expect(feed.ALL.ALL.refreshing).toBe(false);
      expect(feed.ALL.ALL.data.length).toBe(mockDataFeedResponse.list.length);
    });
  });
});
