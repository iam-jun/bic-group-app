import groupApi from '~/api/GroupApi';
import { AttributeFeed, ContentFeed } from '~/interfaces/IFeed';
import { responseTimeline } from '~/test/mock_data/timeline';
import { act, renderHook, waitFor } from '~/test/testUtils';
import useTimelineStore from '../index';

describe('getPosts in group/community', () => {
  it('should get posts success:', async () => {
    jest.useFakeTimers();
    const spyApiGetGroupPosts = jest.spyOn(groupApi, 'getGroupPosts').mockImplementation(
      () => Promise.resolve(responseTimeline) as any,
    );

    const { result } = renderHook(() => useTimelineStore((state) => state));

    act(() => {
      result.current.actions.initDataTimeline('123');
      result.current.actions.getPosts('123');
      jest.advanceTimersByTime(200);
    });

    jest.useRealTimers();

    expect(spyApiGetGroupPosts).toBeCalled();

    await waitFor(() => {
      const { attributeFilter, contentFilter, data } = result.current.timelines['123'];
      expect(attributeFilter).toBe(AttributeFeed.ALL);
      expect(contentFilter).toBe(ContentFeed.ALL);
      expect(data.ALL.ALL.hasNextPage).toBe(responseTimeline.data.meta.hasNextPage);
      expect(data.ALL.ALL.loading).toBe(false);
      expect(data.ALL.ALL.ids.length).toBe(responseTimeline.data.list.length);
    });
  });

  it('should refresh posts success:', async () => {
    jest.useFakeTimers();
    const spyApiGetGroupPosts = jest.spyOn(groupApi, 'getGroupPosts').mockImplementation(
      () => Promise.resolve(responseTimeline) as any,
    );

    const { result } = renderHook(() => useTimelineStore((state) => state));

    useTimelineStore.setState((state): any => ({
      ...state,
      timelines: {
        ...state.timelines,
        123: {
          contentFilter: ContentFeed.ALL,
          attributeFilter: AttributeFeed.ALL,
          data: {
            [ContentFeed.ALL]: {
              [AttributeFeed.ALL]: {
                ids: ['1', '2', '3', '4', '5'],
                loading: false,
                refreshing: false,
                hasNextPage: true,
              },
            },
          },
        },
      },
    }));

    act(() => {
      result.current.actions.getPosts('123', true);
      jest.advanceTimersByTime(200);
    });

    jest.useRealTimers();

    expect(spyApiGetGroupPosts).toBeCalled();

    await waitFor(() => {
      const { attributeFilter, contentFilter, data } = result.current.timelines['123'];
      expect(attributeFilter).toBe(AttributeFeed.ALL);
      expect(contentFilter).toBe(ContentFeed.ALL);
      expect(data.ALL.ALL.hasNextPage).toBe(responseTimeline.data.meta.hasNextPage);
      expect(data.ALL.ALL.loading).toBe(false);
      expect(data.ALL.ALL.ids.length).toBe(responseTimeline.data.list.length);
    });
  });
});
