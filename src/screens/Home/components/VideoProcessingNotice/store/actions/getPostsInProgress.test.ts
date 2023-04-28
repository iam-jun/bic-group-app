import { act, renderHook } from '~/test/testUtils';
import usePostsInProgressStore, { IPostsInProgressState } from '../index';
import streamApi from '~/api/StreamApi';

describe('getPostsInProgress', () => {
  it('should setPostInProgress1 with total = 0 correctly', () => {
    const response = {
      data: [{ id: '1' }],
      total: 1,
    };

    usePostsInProgressStore.setState((state: IPostsInProgressState) => {
      state.total = 0;
      state.data = [{ id: '1' }];
      return state;
    });

    jest.useFakeTimers();
    const spy = jest.spyOn(streamApi, 'getDraftContents').mockImplementation(() => Promise.resolve(response) as any);
    const { result } = renderHook(() => usePostsInProgressStore((state) => state));
    act(() => {
      result.current.actions.getPosts();
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.total).toEqual(0);
    expect(result.current.data).toEqual(response.data);
  });

  it('should setPostInProgress1 correctly', () => {
    const response = {
      data: [{ id: '1' }],
      total: 1,
    };

    usePostsInProgressStore.setState((state: IPostsInProgressState) => {
      state.total = 1;
      state.data = [{ id: '1' }];
      return state;
    });

    jest.useFakeTimers();
    const spy = jest.spyOn(streamApi, 'getDraftContents').mockImplementation(() => Promise.resolve(response) as any);
    const { result } = renderHook(() => usePostsInProgressStore((state) => state));
    act(() => {
      result.current.actions.getPosts();
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.total).toEqual(response.total);
    expect(result.current.data).toEqual(response.data);
  });

  it('should setPostInProgress2 correctly', () => {
    const response = {
      data: [{ id: '1' }],
      total: 1,
    };

    usePostsInProgressStore.setState((state: IPostsInProgressState) => {
      state.total = 1;
      state.data = [{ id: '2' }];
      return state;
    });

    jest.useFakeTimers();
    const spy = jest.spyOn(streamApi, 'getDraftContents').mockImplementation(() => Promise.resolve(response) as any);
    const { result } = renderHook(() => usePostsInProgressStore((state) => state));
    act(() => {
      result.current.actions.getPosts();
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.total).toEqual(response.total);
    expect(result.current.data).toEqual([{ id: '2' }]);
  });

  it('should setPostInProgress3 correctly', () => {
    const response = {
      data: [{ id: '1' }],
      total: 1,
    };

    jest.useFakeTimers();
    const spy = jest.spyOn(streamApi, 'getDraftContents').mockImplementation(() => Promise.resolve(response) as any);
    const { result } = renderHook(() => usePostsInProgressStore((state) => state));
    act(() => {
      result.current.actions.getPosts();
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.total).toEqual(response.total);
    expect(result.current.data).toEqual(response.data);
  });

  it('should get series throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getDraftContents').mockImplementation(() => Promise.reject(error) as any);

    const errorLog = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    jest.useFakeTimers();
    const { result } = renderHook(() => usePostsInProgressStore((state) => state));

    act(() => {
      try {
        result.current.actions.getPosts();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });
    expect(errorLog).toBeCalled();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
