import streamApi from '~/api/StreamApi';
import { act, renderHook } from '~/test/testUtils';
import usePublishStore, { IPublishState } from '../index';
import useYourContentStore from '~/screens/YourContent/store';
import { mockArticle, responseGetScheduleArticles } from '~/test/mock_data/article';
import { ContentFeed } from '~/interfaces/IFeed';

describe('action getPublishContent', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const response = {
    code: 'ok',
    list: [mockArticle],
    meta: { limit: 10, offset: 0, hasNextPage: false },
  };

  it('should call api getNewsfeed when isRefresh = true throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getNewsfeed').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => usePublishStore((state) => state));

    act(() => {
      try {
        result.current.actions.getPublishContent({ isRefresh: true });
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.publishContents[ContentFeed.ALL].refreshing).toBe(false);
    expect(result.current.publishContents[ContentFeed.ALL].loading).toBe(false);
  });

  it('should call api getNewsfeed when isRefresh = true success', () => {
    useYourContentStore.setState((state )=> {
        state.activePublishTab = ContentFeed.ALL;
        return state;
    });

    const spy = jest.spyOn(streamApi, 'getNewsfeed').mockImplementation(
      () => Promise.resolve(response),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => usePublishStore((state) => state));

    act(() => {
      result.current.actions.getPublishContent({ isRefresh: true });
    });
    expect(result.current.publishContents[ContentFeed.ALL].refreshing).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.publishContents[ContentFeed.ALL].ids).toEqual(
        [mockArticle.id]
    );
    expect(result.current.publishContents[ContentFeed.ALL].hasNextPage).toBe(false);
    expect(result.current.publishContents[ContentFeed.ALL].refreshing).toBe(false);
    expect(result.current.publishContents[ContentFeed.ALL].loading).toBe(false);
  });

  it('should call api getNewsfeed when isRefresh = false success', () => {
    useYourContentStore.setState((state )=> {
        state.activePublishTab = ContentFeed.ALL;
        return state;
    });
    const spy = jest.spyOn(streamApi, 'getNewsfeed').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => usePublishStore((state) => state));

    act(() => {
      result.current.actions.getPublishContent({ isRefresh: false });
    });
    expect(result.current.publishContents[ContentFeed.ALL].loading).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.publishContents[ContentFeed.ALL].ids).toEqual(
        [mockArticle.id]
    );
    expect(result.current.publishContents[ContentFeed.ALL].refreshing).toBe(false);
    expect(result.current.publishContents[ContentFeed.ALL].loading).toBe(false);
  });
});
