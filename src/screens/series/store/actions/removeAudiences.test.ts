import streamApi from '~/api/StreamApi';
import usePostsStore from '~/store/entities/posts';
import modalActions from '~/storeRedux/modal/actions';
import { mockSeries, mockSeriesRequest, mockSeriesResponseRemovedAudiences } from '~/test/mock_data/series';
import { act, renderHook } from '~/test/testUtils';
import useSeriesStore, { ISeriesState } from '../index';

describe('removeAudiences', () => {
  const seriesId = mockSeries.id;
  const listAudiences = ['eba85417-ec3e-49b4-89b4-c5393baecaaf'];

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

  it('should remove audiences from series success:', () => {
    const response = {
      code: 200,
      data: mockSeriesResponseRemovedAudiences,
      meta: {},
    };
    const spyApiEditSeries = jest.spyOn(streamApi, 'editSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const spyApiGetSeriesDetail = jest.spyOn(streamApi, 'getSeriesDetail').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const addToPosts = jest.fn();
    const actions = {
      addToPosts,
    };
    jest.spyOn(usePostsStore, 'getState').mockImplementation(() => ({ actions } as any));

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    useSeriesStore.setState((state: ISeriesState) => {
      state.data = mockSeriesRequest as any;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useSeriesStore((state) => state));
    act(() => {
      result.current.actions.removeAudiences(seriesId, listAudiences);
    });

    expect(spyApiEditSeries).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiGetSeriesDetail).toBeCalled();
    expect(addToPosts).toBeCalledWith({ data: mockSeriesResponseRemovedAudiences });
    expect(spyModalActions).toBeCalledWith({ content: 'series:text_deleted_audiences' });
  });

  it('should remove audiences from series throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'editSeries').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    useSeriesStore.setState((state:ISeriesState) => {
      state.data = mockSeriesRequest as any;
      return state;
    });
    jest.useFakeTimers();
    const { result } = renderHook(() => useSeriesStore((state) => state));

    act(() => {
      try {
        result.current.actions.removeAudiences(seriesId, listAudiences);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyModalActions).toBeCalled();
  });
});
