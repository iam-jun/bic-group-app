import streamApi from '~/api/StreamApi';
import usePostsStore from '~/store/entities/posts';
import useModalStore from '~/store/modal';
import { mockSeries, mockSeriesRequest } from '~/test/mock_data/series';
import { act, renderHook } from '~/test/testUtils';
import useSeriesStore, { ISeriesState } from '../index';

describe('editSeries', () => {
  it('should do nothing if id undefined', () => {
    useSeriesStore.setState((state: ISeriesState) => {
      state.data = mockSeriesRequest as any;
      return state;
    });

    const { result } = renderHook(() => useSeriesStore((state) => state));
    act(() => {
      result.current.actions.editSeries('', false, undefined, undefined);
    });

    expect(result.current.loading).not.toBe(true);
  });
  it('should put edit series success:', () => {
    const response = {
      code: 200,
      data: mockSeries,
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
    const spyPostStore = jest.spyOn(usePostsStore, 'getState').mockImplementation(() => ({ actions } as any));

    const showToast = jest.fn();
    const toastActions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions: toastActions } as any));

    useSeriesStore.setState((state: ISeriesState) => {
      state.data = mockSeriesRequest as any;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useSeriesStore((state) => state));
    act(() => {
      result.current.actions.editSeries(mockSeries.id, true, undefined, undefined);
    });

    expect(result.current.loading).toBe(true);
    expect(spyApiEditSeries).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiGetSeriesDetail).toBeCalled();
    expect(result.current.loading).toBe(false);
    expect(spyPostStore).toBeCalled();
    expect(addToPosts).toBeCalledWith({ data: mockSeries });
    expect(showToast).toBeCalledWith({ content: 'series:text_edit_series_success' });
  });

  it('should put edit series throw error and should show toast', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'editSeries').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const onRetry = jest.fn();

    useSeriesStore.setState((state:ISeriesState) => {
      state.data = mockSeriesRequest as any;
      return state;
    });
    jest.useFakeTimers();
    const { result } = renderHook(() => useSeriesStore((state) => state));

    act(() => {
      try {
        result.current.actions.editSeries(mockSeries.id, true, () => onRetry(), undefined);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.loading).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBe(false);
    expect(showToast).toBeCalled();
  });

  it('should put edit series throw error and props callbackError should called', () => {
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
    const spy = jest.spyOn(streamApi, 'editSeries').mockImplementation(
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
        result.current.actions.editSeries(mockSeries.id, true, undefined, callbackError);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.loading).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBe(false);
    expect(callbackError).toBeCalled();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
