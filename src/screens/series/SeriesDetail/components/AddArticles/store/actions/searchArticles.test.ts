import streamApi from '~/api/StreamApi';
import useModalStore from '~/store/modal';
import { listArticle, searchSeriesRequestParams } from '~/test/mock_data/series';
import { act, renderHook } from '~/test/testUtils';
import useAddArticlesStore, { IAddArticlesState } from '../index';

describe('searchArticles in series', () => {
  it('should search articles success without contentSearch', () => {
    const response = {
      code: 200,
      data: {
        list: listArticle,
        meta: {
          total: listArticle.length,
          offset: 0,
        },
      },
      meta: {},
    };

    const spyApiSearchArticles = jest.spyOn(streamApi, 'searchArticleInSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAddArticlesStore((state) => state));
    act(() => {
      result.current.actions.searchArticles({ ...searchSeriesRequestParams, contentSearch: '' });
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.key).toBe('');
    expect(spyApiSearchArticles).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.items).toBe(listArticle);
  });

  it('should search articles success with contentSearch', () => {
    const response = {
      code: 200,
      data: {
        list: listArticle,
        meta: {
          total: listArticle.length,
          offset: 0,
        },
      },
      meta: {},
    };

    const spyApiSearchArticles = jest.spyOn(streamApi, 'searchArticleInSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAddArticlesStore((state) => state));
    act(() => {
      result.current.actions.searchArticles({ ...searchSeriesRequestParams, contentSearch: 'test' });
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.key).toBe('test');
    expect(result.current.hasNextPage).toBe(true);
    expect(spyApiSearchArticles).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.items).toBe(listArticle);
  });

  it('should do nothing when loadMore but hasNextPage = false:', () => {
    useAddArticlesStore.setState((state: IAddArticlesState) => {
      state.hasNextPage = false;
      return state;
    });

    const { result } = renderHook(() => useAddArticlesStore((state) => state));
    act(() => {
      result.current.actions.searchArticles({ ...searchSeriesRequestParams, contentSearch: '' }, true);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.hasNextPage).toBe(false);
  });

  it('should loadMore articles success:', () => {
    useAddArticlesStore.setState((state: IAddArticlesState) => {
      state.items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as any;
      state.hasNextPage = true;
      return state;
    });

    const total = listArticle.length + 20;

    const response = {
      code: 200,
      data: {
        list: listArticle,
        meta: {
          total,
          offset: 0,
        },
      },
      meta: {},
    };

    const spyApiSearchArticles = jest.spyOn(streamApi, 'searchArticleInSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAddArticlesStore((state) => state));
    act(() => {
      result.current.actions.searchArticles({ ...searchSeriesRequestParams, contentSearch: '' }, true);
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.key).toBe('');
    expect(result.current.hasNextPage).toBe(true);
    expect(spyApiSearchArticles).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.items?.length).toBe(total);
  });

  it('should search articles throw error and should show toast', () => {
    const error = 'internal error';
    const spyApiSearchArticles = jest.spyOn(streamApi, 'searchArticleInSeries').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useAddArticlesStore((state) => state));

    act(() => {
      try {
        result.current.actions.searchArticles({ ...searchSeriesRequestParams, contentSearch: 'test' });
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.key).toBe('test');
    expect(spyApiSearchArticles).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBe(false);
    expect(showToast).toBeCalled();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
