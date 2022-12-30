import streamApi from '~/api/StreamApi';
import usePostsStore from '~/store/entities/posts';
import useModalStore from '~/store/modal';
import { mockSeries, mockSeriesRequest } from '~/test/mock_data/series';
import { act, renderHook } from '~/test/testUtils';
import useSeriesStore, { ISeriesState } from '../index';

describe('deleteSeries', () => {
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

  it('should delete series success:', () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };
    const spyApiDeleteSeries = jest.spyOn(streamApi, 'deleteSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const callbackError = jest.fn();

    useSeriesStore.setState((state: ISeriesState) => {
      state.data = mockSeriesRequest as any;
      return state;
    });

    const addToPosts = jest.fn();
    const actions = {
      addToPosts,
    };
    jest.spyOn(usePostsStore, 'getState').mockImplementation(() => ({
      actions,
      posts: {
        [mockSeries.id]: mockSeries,
      },
    } as any));

    const showToast = jest.fn();
    const toastActions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions: toastActions } as any));

    const deletedSeries = {
      ...mockSeries,
      deleted: true,
    };

    jest.useFakeTimers();
    const { result } = renderHook(() => useSeriesStore((state) => state));
    act(() => {
      result.current.actions.deleteSeries(mockSeries.id, callbackError);
    });

    expect(spyApiDeleteSeries).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(addToPosts).toBeCalledWith({ data: deletedSeries });
    expect(showToast).toBeCalledWith({ content: 'series:text_delete_series_success' });
  });

  it('should delete series throw error and should show toast', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'deleteSeries').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const callbackError = jest.fn();

    useSeriesStore.setState((state:ISeriesState) => {
      state.data = mockSeriesRequest as any;
      return state;
    });
    jest.useFakeTimers();
    const { result } = renderHook(() => useSeriesStore((state) => state));

    act(() => {
      try {
        result.current.actions.deleteSeries(mockSeries.id, callbackError);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalled();
  });

  it('should delete series throw error and props callbackError should called', () => {
    const error = {
      code: 'api.validation_error',
      data: 'undefined',
      meta: {
        errors: {
          groups_denied: [
            'eba85417-ec3e-49b4-89b4-c5393baecaaf',
          ],
        },
        message: "You don't have delete own post permission at group Community AB",
        stack: null,
      },
    };
    const spy = jest.spyOn(streamApi, 'deleteSeries').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const callbackError = jest.fn();

    useSeriesStore.setState((state:ISeriesState) => {
      state.data = mockSeriesRequest as any;
      return state;
    });
    jest.useFakeTimers();
    const { result } = renderHook(() => useSeriesStore((state) => state));

    act(() => {
      try {
        result.current.actions.deleteSeries(mockSeries.id, callbackError);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(callbackError).toBeCalledWith(error.meta.errors.groups_denied);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
