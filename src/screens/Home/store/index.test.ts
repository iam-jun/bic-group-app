import streamApi from '~/api/StreamApi';
import { feedData, mockDataFeedResponse } from '~/test/mock_data/home';
import { renderHook } from '~/test/testUtils';
import useHomeStore from '.';
import { ATTRIBUTE_FEED, CONTENT_FEED } from './Interface';

describe('useHomeStore hook', () => {
  it('setContentFilter should set contentFilter', () => {
    const { result } = renderHook(() => useHomeStore());

    result.current.actions.setContentFilter(CONTENT_FEED.ALL);
    expect(result.current.contentFilter).toBe(CONTENT_FEED.ALL);

    result.current.actions.setContentFilter(CONTENT_FEED.ARTICLE);
    expect(result.current.contentFilter).toBe(CONTENT_FEED.ARTICLE);

    result.current.actions.setContentFilter(CONTENT_FEED.POST);
    expect(result.current.contentFilter).toBe(CONTENT_FEED.POST);

    result.current.actions.setContentFilter(CONTENT_FEED.SERIES);
    expect(result.current.contentFilter).toBe(CONTENT_FEED.SERIES);
  });

  it('setAttributeFilter should set attributeFilter', () => {
    const { result } = renderHook(() => useHomeStore());

    result.current.actions.setAttributeFilter(ATTRIBUTE_FEED.ALL);
    expect(result.current.attributeFilter).toBe(ATTRIBUTE_FEED.ALL);

    result.current.actions.setAttributeFilter(ATTRIBUTE_FEED.IMPORTANT);
    expect(result.current.attributeFilter).toBe(ATTRIBUTE_FEED.IMPORTANT);
  });

  it('setDataFeed without specify content vs attribute should set feed with current contentFilter vs attributeFilter', () => {
    const { result } = renderHook(() => useHomeStore());

    result.current.actions.setContentFilter(CONTENT_FEED.ALL);
    result.current.actions.setAttributeFilter(ATTRIBUTE_FEED.ALL);

    result.current.actions.setDataFeed(feedData);
    const feed = result.current.feed[CONTENT_FEED.ALL][ATTRIBUTE_FEED.ALL];
    expect(feed.data.length).toBe(feedData.data.length);
    expect(feed.canLoadMore).toBe(feedData.canLoadMore);
    expect(feed.isLoading).toBe(feedData.isLoading);
    expect(feed.refreshing).toBe(feedData.refreshing);
  });

  it('setDataFeed with specify content vs attribute should set feed with content vs attribute', () => {
    const { result } = renderHook(() => useHomeStore());

    result.current.actions.setDataFeed(feedData, CONTENT_FEED.ARTICLE, ATTRIBUTE_FEED.ALL);
    const feed = result.current.feed[CONTENT_FEED.ARTICLE][ATTRIBUTE_FEED.ALL];
    expect(feed.data.length).toBe(feedData.data.length);
    expect(feed.canLoadMore).toBe(feedData.canLoadMore);
    expect(feed.isLoading).toBe(feedData.isLoading);
    expect(feed.refreshing).toBe(feedData.refreshing);
  });

  it('getDataFeed should follow current contentFilter vs attributeFilter', async () => {
    const mockCallApi = jest.spyOn(streamApi, 'getNewsfeed').mockImplementation(() => Promise.resolve(mockDataFeedResponse));
    const { result, waitForNextUpdate } = renderHook(() => useHomeStore());

    result.current.actions.setContentFilter(CONTENT_FEED.ALL);
    result.current.actions.setAttributeFilter(ATTRIBUTE_FEED.ALL);

    result.current.actions.getDataFeed();
    await waitForNextUpdate();

    expect(mockCallApi).toBeCalled();

    const feed = result.current.feed[CONTENT_FEED.ALL][ATTRIBUTE_FEED.ALL];

    expect(feed.data.length).toBe(2);
    expect(feed.canLoadMore).toBe(true);
    expect(feed.isLoading).toBe(false);
    expect(feed.refreshing).toBe(false);
  });
});
