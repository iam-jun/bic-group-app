import streamApi from '~/api/StreamApi';
import { mockListSeriesOfArticle, searchSeriesRequestParams } from '~/test/mock_data/series';
import { act, renderHook } from '~/test/testUtils';
import useSelectSeriesStore, { ISelectSeriesState } from '../index';
import useModalStore from '~/store/modal';

describe('getSeries in article', () => {
  it('should do nothing if isLoadMore but hasNextPage = false', () => {
    useSelectSeriesStore.setState((state: ISelectSeriesState) => {
      state.listSeries.hasNextPage = false;
      return state;
    });

    const { result } = renderHook(() => useSelectSeriesStore((state) => state));
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
    const { result } = renderHook(() => useSelectSeriesStore((state) => state));
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
    useSelectSeriesStore.setState((state: ISelectSeriesState) => {
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
    const { result } = renderHook(() => useSelectSeriesStore((state) => state));
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

  it('should get series throw error and should show toast', () => {
    const error = 'internal error';
    const spyApiGetSeriesByAudiences = jest.spyOn(streamApi, 'searchSeries').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useSelectSeriesStore((state) => state));

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
    expect(showToast).toBeCalled();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
