import { renderHook, act } from '~/test/testUtils';
import streamApi from '~/api/StreamApi';
import useDraftArticleStore, { IDraftArticleState } from '../index';
import { POST_DETAIL } from '~/test/mock_data/post';

describe('getDraftArticles', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should call api get draft articles when isRefresh = true success', () => {
    const response = {
      data: [POST_DETAIL],
      canLoadMore: true,
      total: 1,
    };

    const spy = jest.spyOn(streamApi, 'getDraftArticles').mockImplementation(
      () => Promise.resolve(response),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useDraftArticleStore((state) => state));

    act(() => {
      result.current.actions.getDraftArticles({ isRefresh: true });
    });
    expect(result.current.refreshing).toBe(true);
    expect(result.current.total).toBe(0);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.articles).toEqual(response.data);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.refreshing).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.total).toBe(1);
  });

  it('should call api get draft articles when isRefresh = false success', () => {
    const response = {
      data: [POST_DETAIL],
      canLoadMore: true,
      total: 1,
    };

    const spy = jest.spyOn(streamApi, 'getDraftArticles').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    useDraftArticleStore.setState((state: IDraftArticleState) => {
      state.articles = [];
      state.total = 0;
      state.hasNextPage = true;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useDraftArticleStore((state) => state));

    act(() => {
      result.current.actions.getDraftArticles({ isRefresh: false });
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.articles).toEqual(response.data);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.refreshing).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.total).toBe(1);
  });

  it('should not call API when isRefresh = false and cannot load more', () => {
    const spy = jest.spyOn(streamApi, 'getDraftArticles').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    useDraftArticleStore.setState((state: IDraftArticleState) => {
      state.articles = [];
      state.total = 0;
      state.hasNextPage = false;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useDraftArticleStore((state) => state));

    act(() => {
      result.current.actions.getDraftArticles({ isRefresh: false });
    });
    expect(spy).not.toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should call api get draft articles when isRefresh = true and throws error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getDraftArticles').mockImplementation(
      () => Promise.reject(error) as any,
    );

    useDraftArticleStore.setState((state:IDraftArticleState) => {
      state.articles = [] as any;
      state.hasNextPage = true;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useDraftArticleStore((state) => state));

    act(() => {
      try {
        result.current.actions.getDraftArticles({ isRefresh: true });
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.refreshing).toBe(false);
    expect(result.current.loading).toBe(false);
  });
});
