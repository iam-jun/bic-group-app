import streamApi from '~/api/StreamApi';
import usePostsStore from '~/store/entities/posts';
import { mockSeries, mockSeriesRequest } from '~/test/mock_data/series';
import { act, renderHook } from '~/test/testUtils';
import useSeriesStore, { ISeriesState } from '../index';

describe('getSeriesDetail', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const seriesId = mockSeries.id;

  it('should do nothing if id undefined', () => {
    useSeriesStore.setState((state: ISeriesState) => {
      state.data = mockSeriesRequest as any;
      return state;
    });

    const { result } = renderHook(() => useSeriesStore((state) => state));
    act(() => {
      result.current.actions.deleteSeries('', undefined);
    });

    expect(result.current.loading).not.toBe(true);
  });

  it('should get series success:', () => {
    const response = {
      code: 200,
      data: mockSeries,
      meta: {},
    };
    const spy = jest.spyOn(streamApi, 'getSeriesDetail').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const addToPosts = jest.fn();
    const actions = {
      addToPosts,
    };
    jest.spyOn(usePostsStore, 'getState').mockImplementation(() => ({ actions } as any));

    useSeriesStore.setState((state: ISeriesState) => {
      state.requestings = {};
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useSeriesStore((state) => state));
    act(() => {
      result.current.actions.getSeriesDetail(seriesId);
    });

    expect(result.current.requestings?.[seriesId]).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.requestings?.[seriesId]).toBeUndefined();
    expect(addToPosts).toBeCalledWith({ data: mockSeries, handleComment: true });
  });

  it('should get series throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getSeriesDetail').mockImplementation(
      () => Promise.reject(error) as any,
    );

    useSeriesStore.setState((state:ISeriesState) => {
      state.requestings = {};
      return state;
    });
    jest.useFakeTimers();
    const { result } = renderHook(() => useSeriesStore((state) => state));

    act(() => {
      try {
        result.current.actions.getSeriesDetail(seriesId);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.requestings?.[seriesId]).toBe(true);

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.requestings?.[seriesId]).toBeUndefined();
  });
});
