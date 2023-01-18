import streamApi from '~/api/StreamApi';
import { act, renderHook } from '~/test/testUtils';
import useScheduleArticlesStore, { IScheduleArticlesState } from '../index';
import { mockArticle } from '~/test/mock_data/article';

describe('getScheduleArticles', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should call api getArticleByParams when isRefresh = true throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getArticleByParams').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useScheduleArticlesStore((state) => state));

    act(() => {
      try {
        result.current.actions.getScheduleArticles({ isRefresh: true });
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.scheduleArticles.refreshing).toBe(false);
    expect(result.current.scheduleArticles.loading).toBe(false);
  });

  it('should not call api getArticleByParams when isRefresh = false and hasNextPage = false', () => {
    const spy = jest.spyOn(streamApi, 'getArticleByParams').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    useScheduleArticlesStore.setState((state: IScheduleArticlesState) => {
      state.scheduleArticles.data = [];
      state.scheduleArticles.total = 0;
      state.scheduleArticles.hasNextPage = false;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useScheduleArticlesStore((state) => state));

    act(() => {
      result.current.actions.getScheduleArticles({ isRefresh: false });
    });

    expect(spy).not.toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should call api getArticleByParams when isRefresh = true success', () => {
    const response = {
      data: [mockArticle],
      canLoadMore: true,
      total: 1,
    };

    const spy = jest.spyOn(streamApi, 'getArticleByParams').mockImplementation(
      () => Promise.resolve(response),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useScheduleArticlesStore((state) => state));

    act(() => {
      result.current.actions.getScheduleArticles({ isRefresh: true });
    });
    expect(result.current.scheduleArticles.refreshing).toBe(true);
    expect(result.current.scheduleArticles.total).toBe(0);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.scheduleArticles.data).toEqual(response.data);
    expect(result.current.scheduleArticles.hasNextPage).toBe(true);
    expect(result.current.scheduleArticles.refreshing).toBe(false);
    expect(result.current.scheduleArticles.loading).toBe(false);
    expect(result.current.scheduleArticles.total).toBe(1);
  });

  it('should call api getArticleByParams when isRefresh = false success', () => {
    const response = {
      data: [mockArticle],
      canLoadMore: true,
      total: 1,
    };

    const spy = jest.spyOn(streamApi, 'getArticleByParams').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useScheduleArticlesStore((state) => state));

    act(() => {
      result.current.actions.getScheduleArticles({ isRefresh: false });
    });
    expect(result.current.scheduleArticles.loading).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.scheduleArticles.data).toEqual(response.data);
    expect(result.current.scheduleArticles.refreshing).toBe(false);
    expect(result.current.scheduleArticles.loading).toBe(false);
    expect(result.current.scheduleArticles.total).toBe(1);
  });
});
