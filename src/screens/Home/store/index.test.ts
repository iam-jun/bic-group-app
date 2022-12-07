import streamApi from '~/api/StreamApi';
import { feedData, mockDataFeedResponse } from '~/test/mock_data/home';
import { renderHook } from '~/test/testUtils';
import useHomeStore from '.';
import { AttributeFeed, ContentFeed } from '~/interfaces/IFeed';

describe('useHomeStore hook', () => {
  it('setContentFilter should set contentFilter', () => {
    const { result } = renderHook(() => useHomeStore());

    result.current.actions.setContentFilter(ContentFeed.ALL);
    expect(result.current.contentFilter).toBe(ContentFeed.ALL);

    result.current.actions.setContentFilter(ContentFeed.ARTICLE);
    expect(result.current.contentFilter).toBe(ContentFeed.ARTICLE);

    result.current.actions.setContentFilter(ContentFeed.POST);
    expect(result.current.contentFilter).toBe(ContentFeed.POST);

    result.current.actions.setContentFilter(ContentFeed.SERIES);
    expect(result.current.contentFilter).toBe(ContentFeed.SERIES);
  });

  it('setAttributeFilter should set attributeFilter', () => {
    const { result } = renderHook(() => useHomeStore());

    result.current.actions.setAttributeFilter(AttributeFeed.ALL);
    expect(result.current.attributeFilter).toBe(AttributeFeed.ALL);

    result.current.actions.setAttributeFilter(AttributeFeed.IMPORTANT);
    expect(result.current.attributeFilter).toBe(AttributeFeed.IMPORTANT);
  });

  it('setDataFeed without specify content vs attribute should set feed with current contentFilter vs attributeFilter', () => {
    const { result } = renderHook(() => useHomeStore());

    result.current.actions.setContentFilter(ContentFeed.ALL);
    result.current.actions.setAttributeFilter(AttributeFeed.ALL);

    result.current.actions.setDataFeed(feedData);
    const feed = result.current.feed[ContentFeed.ALL][AttributeFeed.ALL];
    expect(feed.data.length).toBe(feedData.data.length);
    expect(feed.canLoadMore).toBe(feedData.canLoadMore);
    expect(feed.isLoading).toBe(feedData.isLoading);
    expect(feed.refreshing).toBe(feedData.refreshing);
  });

  it('setDataFeed with specify content vs attribute should set feed with content vs attribute', () => {
    const { result } = renderHook(() => useHomeStore());

    result.current.actions.setDataFeed(feedData, ContentFeed.ARTICLE, AttributeFeed.ALL);
    const feed = result.current.feed[ContentFeed.ARTICLE][AttributeFeed.ALL];
    expect(feed.data.length).toBe(feedData.data.length);
    expect(feed.canLoadMore).toBe(feedData.canLoadMore);
    expect(feed.isLoading).toBe(feedData.isLoading);
    expect(feed.refreshing).toBe(feedData.refreshing);
  });

  it('getDataFeed should follow current contentFilter vs attributeFilter', async () => {
    const mockCallApi = jest.spyOn(streamApi, 'getNewsfeed').mockImplementation(() => Promise.resolve(mockDataFeedResponse));
    const { result, waitForNextUpdate } = renderHook(() => useHomeStore());

    result.current.actions.setContentFilter(ContentFeed.ALL);
    result.current.actions.setAttributeFilter(AttributeFeed.ALL);

    result.current.actions.getDataFeed();
    await waitForNextUpdate();

    expect(mockCallApi).toBeCalled();

    const feed = result.current.feed[ContentFeed.ALL][AttributeFeed.ALL];

    expect(feed.data.length).toBe(2);
    expect(feed.canLoadMore).toBe(true);
    expect(feed.isLoading).toBe(false);
    expect(feed.refreshing).toBe(false);
  });
});
