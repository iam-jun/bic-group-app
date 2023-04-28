import streamApi from '~/api/StreamApi';
import { POST_DETAIL } from '~/test/mock_data/post';
import { act, renderHook } from '~/test/testUtils';
import useTopicStore, { ITopicState } from '../index';

describe('getArticleTopicDetail', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should call api get articles topic detail when isRefresh = true throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getArticleTopicDetail').mockImplementation(
      () => Promise.reject(error) as any,
    );

    useTopicStore.setState((state: ITopicState) => {
      state.articles.data = [] as any;
      state.articles.hasNextPage = true;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useTopicStore((state) => state));

    act(() => {
      try {
        result.current.actions.getArticleTopicDetail({ isRefresh: true });
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.articles.refreshing).toBe(false);
    expect(result.current.articles.loading).toBe(false);
  });

  it('should not call API when isRefresh = false and cannot load more', () => {
    const spy = jest.spyOn(streamApi, 'getArticleTopicDetail').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    useTopicStore.setState((state: ITopicState) => {
      state.articles.data = [];
      state.articles.total = 0;
      state.articles.hasNextPage = false;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useTopicStore((state) => state));

    act(() => {
      result.current.actions.getArticleTopicDetail({ isRefresh: false });
    });

    expect(spy).not.toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should call api get articles topic detail when isRefresh = true success', () => {
    const response = {
      data: [POST_DETAIL],
      canLoadMore: true,
      total: 1,
    };

    const spy = jest.spyOn(streamApi, 'getArticleTopicDetail').mockImplementation(
      () => Promise.resolve(response),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useTopicStore((state) => state));

    act(() => {
      result.current.actions.getArticleTopicDetail({ isRefresh: true });
    });
    expect(result.current.articles.refreshing).toBe(true);
    expect(result.current.articles.total).toBe(0);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.articles.data).toEqual(response.data);
    expect(result.current.articles.hasNextPage).toBe(true);
    expect(result.current.articles.refreshing).toBe(false);
    expect(result.current.articles.loading).toBe(false);
    expect(result.current.articles.total).toBe(1);
  });

  it('should call api get articles topic detail when isRefresh = false success', () => {
    const response = {
      data: [POST_DETAIL],
      canLoadMore: true,
      total: 1,
    };

    const spy = jest.spyOn(streamApi, 'getArticleTopicDetail').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    useTopicStore.setState((state: ITopicState) => {
      state.articles.data = [];
      state.articles.total = 0;
      state.articles.hasNextPage = true;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useTopicStore((state) => state));

    act(() => {
      result.current.actions.getArticleTopicDetail({ isRefresh: false });
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.articles.data).toEqual(response.data);
    expect(result.current.articles.hasNextPage).toBe(true);
    expect(result.current.articles.refreshing).toBe(false);
    expect(result.current.articles.loading).toBe(false);
    expect(result.current.articles.total).toBe(1);
  });
});
