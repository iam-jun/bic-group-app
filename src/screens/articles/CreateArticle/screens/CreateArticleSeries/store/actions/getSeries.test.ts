import streamApi from '~/api/StreamApi';
import modalActions from '~/storeRedux/modal/actions';
import { mockListSeriesOfArticle, searchSeriesRequestParams } from '~/test/mock_data/series';
import { act, renderHook } from '~/test/testUtils';
import useCreateArticleSeriesStore, { ICreateArticleSeriesState } from '../index';

describe('getSeries in article', () => {
  it('should do nothing if isLoadMore but hasNextPage = false', () => {
    useCreateArticleSeriesStore.setState((state: ICreateArticleSeriesState) => {
      state.listSeries.hasNextPage = false;
      return state;
    });

    const { result } = renderHook(() => useCreateArticleSeriesStore((state) => state));
    act(() => {
      result.current.actions.getSeries(true, {});
    });

    expect(result.current.listSeries.loading).not.toBe(true);
  });

  it('should get list series success:', () => {
    const response = {
      code: 200,
      data: {
        list: mockListSeriesOfArticle,
        meta: {
          total: mockListSeriesOfArticle.length,
          offset: 0,
        },
      },
      meta: {},
    };

    const spyApiGetSeriesByAudiences = jest.spyOn(streamApi, 'searchSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useCreateArticleSeriesStore((state) => state));
    act(() => {
      result.current.actions.getSeries(false, searchSeriesRequestParams);
    });

    expect(result.current.listSeries.loading).toBe(true);
    expect(spyApiGetSeriesByAudiences).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.listSeries.loading).toBe(false);
    expect(result.current.listSeries.items).toBe(mockListSeriesOfArticle);
    expect(result.current.listSeries.hasNextPage).toBe(false);
  });

  it('should load more list series success:', () => {
    useCreateArticleSeriesStore.setState((state: ICreateArticleSeriesState) => {
      state.listSeries.hasNextPage = true;
      state.listSeries.items = [1];
      return state;
    });

    const mockListResponse = [2, 3];

    const response = {
      code: 200,
      data: {
        list: mockListResponse,
        meta: {
          total: mockListResponse.length + 5,
          offset: 1,
        },
      },
      meta: {},
    };

    const spyApiGetSeriesByAudiences = jest.spyOn(streamApi, 'searchSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useCreateArticleSeriesStore((state) => state));
    act(() => {
      result.current.actions.getSeries(true, searchSeriesRequestParams);
    });

    expect(result.current.listSeries.loading).toBe(true);
    expect(spyApiGetSeriesByAudiences).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.listSeries.loading).toBe(false);
    expect(result.current.listSeries.hasNextPage).toBe(true);
    expect(result.current.listSeries.items).toStrictEqual([1, 2, 3]);
  });

  it('should get series success but respone list is undefined and should show toast', () => {
    const response = {
      code: 200,
      data: {
        list: undefined,
        meta: {
          total: 0,
          offset: 0,
        },
      },
      meta: {},
    };

    const spyApiGetSeriesByAudiences = jest.spyOn(streamApi, 'searchSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useCreateArticleSeriesStore((state) => state));

    act(() => {
      result.current.actions.getSeries(false, searchSeriesRequestParams);
    });

    expect(result.current.listSeries.loading).toBe(true);
    expect(spyApiGetSeriesByAudiences).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.listSeries.loading).toBe(false);
    expect(result.current.listSeries.hasNextPage).toBe(false);
    expect(spyModalActions).toBeCalled();
  });

  it('should get series throw error and should show toast', () => {
    const error = 'internal error';
    const spyApiGetSeriesByAudiences = jest.spyOn(streamApi, 'searchSeries').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useCreateArticleSeriesStore((state) => state));

    act(() => {
      try {
        result.current.actions.getSeries(false, searchSeriesRequestParams);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.listSeries.loading).toBe(true);
    expect(spyApiGetSeriesByAudiences).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.listSeries.loading).toBe(false);
    expect(spyModalActions).toBeCalled();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
