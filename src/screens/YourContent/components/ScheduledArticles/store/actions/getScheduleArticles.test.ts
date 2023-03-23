import streamApi from '~/api/StreamApi';
import { act, renderHook } from '~/test/testUtils';
import useScheduleArticlesStore, { IScheduleArticlesState } from '../index';
import { mockArticle, responseGetScheduleArticles } from '~/test/mock_data/article';

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

  it('should call api getArticleByParams when isRefresh = true success', () => {
    const spy = jest.spyOn(streamApi, 'getArticleByParams').mockImplementation(
      () => Promise.resolve(responseGetScheduleArticles),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useScheduleArticlesStore((state) => state));

    act(() => {
      result.current.actions.getScheduleArticles({ isRefresh: true });
    });
    expect(result.current.scheduleArticles.refreshing).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.scheduleArticles.data).toEqual(responseGetScheduleArticles.data.list);
    expect(result.current.scheduleArticles.hasNextPage).toBe(false);
    expect(result.current.scheduleArticles.refreshing).toBe(false);
    expect(result.current.scheduleArticles.loading).toBe(false);
  });

  it('should call api getArticleByParams when isRefresh = false success', () => {
    useScheduleArticlesStore.setState((state: IScheduleArticlesState) => {
      state.scheduleArticles.data = [mockArticle] as any;
      return state;
    });
    const spy = jest.spyOn(streamApi, 'getArticleByParams').mockImplementation(
      () => Promise.resolve(responseGetScheduleArticles) as any,
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

    expect(result.current.scheduleArticles.data.length).toBe(2);
    expect(result.current.scheduleArticles.refreshing).toBe(false);
    expect(result.current.scheduleArticles.loading).toBe(false);
  });
});
