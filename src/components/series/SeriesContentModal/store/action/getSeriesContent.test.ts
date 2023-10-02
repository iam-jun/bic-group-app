import streamApi from '~/api/StreamApi';
import { act, renderHook } from '~/test/testUtils';
import useSeriesContentModalStore, { ISeriesContentModalState } from '../index';
import { mockSeries } from '~/test/mock_data/series';
import { mockArticle } from '~/test/mock_data/article';
import { IGetSeries } from '~/interfaces/ISeries';

describe('getSeriesContent', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should call api getSeriesContent throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getSeriesContent').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useSeriesContentModalStore((state) => state));

    act(() => {
      try {
        result.current.actions.getSeriesContent(mockArticle.id);
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

  it('should call api getSeriesContent success', () => {
    const response = {
      data: {
        list: [mockSeries],
      },
    };
    const spy = jest.spyOn(streamApi, 'getSeriesContent').mockImplementation(
      () => Promise.resolve(response),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useSeriesContentModalStore((state) => state));

    act(() => {
      result.current.actions.getSeriesContent(mockArticle.id);
    });
    expect(result.current.series.loading).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.series.data).toEqual(response.data.list);
    expect(result.current.series.loading).toBe(false);
  });

  it('should not call api getSeriesContent when loading = true and hasNextPage = false', () => {
    const spy = jest.spyOn(streamApi, 'getSeriesContent').mockImplementation(
      () => Promise.resolve({}),
    );

    useSeriesContentModalStore.setState((state: ISeriesContentModalState) => {
      state.series.loading = true;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useSeriesContentModalStore((state) => state));

    act(() => {
      result.current.actions.getSeriesContent(mockArticle.id);
    });
    expect(spy).not.toBeCalled();

    act(() => {
      jest.runAllTimers();
    });
  });
});
