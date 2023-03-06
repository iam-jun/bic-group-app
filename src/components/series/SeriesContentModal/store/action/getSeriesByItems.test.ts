import streamApi from '~/api/StreamApi';
import { act, renderHook } from '~/test/testUtils';
import useSeriesContentModalStore, { ISeriesContentModalState } from '../index';
import { mockSeries } from '~/test/mock_data/series';
import { mockArticle } from '~/test/mock_data/article';
import { IGetSeries } from '~/interfaces/ISeries';

describe('getSeriesByItems', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should call api searchSeries throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'searchSeries').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useSeriesContentModalStore((state) => state));

    act(() => {
      try {
        result.current.actions.getSeriesByItems({ itemIds: [mockArticle.id] } as IGetSeries);
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.series.loading).toBe(false);
    expect(result.current.series.data).toEqual([]);
  });

  it('should call api searchSeries success', () => {
    const response = {
      data: {
        list: [mockSeries],
      },
      canLoadMore: true,
      total: 1,
    };
    const spy = jest.spyOn(streamApi, 'searchSeries').mockImplementation(
      () => Promise.resolve(response),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useSeriesContentModalStore((state) => state));

    act(() => {
      result.current.actions.getSeriesByItems({ itemIds: [mockArticle.id] } as IGetSeries);
    });
    expect(result.current.series.loading).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.series.data).toEqual(response.data.list);
    expect(result.current.series.loading).toBe(false);
  });

  it('should not call api searchSeries when loading = true and hasNextPage = false', () => {
    const spy = jest.spyOn(streamApi, 'searchSeries').mockImplementation(
      () => Promise.resolve({}),
    );

    useSeriesContentModalStore.setState((state: ISeriesContentModalState) => {
      state.series.hasNextPage = false;
      state.series.loading = true;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useSeriesContentModalStore((state) => state));

    act(() => {
      result.current.actions.getSeriesByItems({ itemIds: [mockArticle.id] } as IGetSeries);
    });
    expect(spy).not.toBeCalled();

    act(() => {
      jest.runAllTimers();
    });
  });
});
