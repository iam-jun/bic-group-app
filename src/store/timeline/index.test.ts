import { isEmpty } from 'lodash';
import { AttributeFeed, ContentFeed } from '~/interfaces/IFeed';
import { act, renderHook } from '~/test/testUtils';
import useTimelineStore, { initData } from '.';

describe('useTimelineStore in group/community', () => {
  it('given gorup id should initDataTimeline', () => {
    const { result } = renderHook(() => useTimelineStore((state) => state));

    act(() => {
      result.current.actions.initDataTimeline('123');
    });

    expect(result.current.timelines['123']).toBeDefined();

    const { attributeFilter, contentFilter, data } = result.current.timelines['123'];
    expect(attributeFilter).toBe(AttributeFeed.ALL);
    expect(contentFilter).toBe(ContentFeed.ALL);
    expect(JSON.stringify(data)).toBe(JSON.stringify(initData));
  });

  it('given group id and ContentFeed should setContentFilter', () => {
    const { result } = renderHook(() => useTimelineStore((state) => state));

    act(() => {
      result.current.actions.initDataTimeline('123');
      result.current.actions.setContentFilter('123', ContentFeed.ARTICLE);
    });

    expect(result.current.timelines['123']).toBeDefined();

    const { contentFilter } = result.current.timelines['123'];
    expect(contentFilter).toBe(ContentFeed.ARTICLE);
  });

  it('given group id and AttributeFeed should setAttributeFilter', () => {
    const { result } = renderHook(() => useTimelineStore((state) => state));

    act(() => {
      result.current.actions.initDataTimeline('123');
      result.current.actions.setAttributeFilter('123', AttributeFeed.IMPORTANT);
    });

    expect(result.current.timelines['123']).toBeDefined();

    const { attributeFilter } = result.current.timelines['123'];
    expect(attributeFilter).toBe(AttributeFeed.IMPORTANT);
  });

  it('given group id should resetTimeline', () => {
    const { result } = renderHook(() => useTimelineStore((state) => state));

    act(() => {
      result.current.actions.initDataTimeline('123');
    });

    expect(result.current.timelines['123']).toBeDefined();

    act(() => {
      result.current.actions.resetTimeline('123');
    });

    expect(isEmpty(result.current.timelines['123'])).toBeTruthy();
  });
});
