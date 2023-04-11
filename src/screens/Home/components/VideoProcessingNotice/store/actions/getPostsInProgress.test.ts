import { act, renderHook } from '~/test/testUtils';
import usePostsInProgressStore, { IPostsInProgressState } from '../index';
import streamApi from '~/api/StreamApi';

describe('getPostsInProgress', () => {
  it('should get data success with data.length = 0', () => {
    const response = {
      data: [],
      total: 0,
    };
    const spy = jest.spyOn(streamApi, 'getDraftPosts').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const { result } = renderHook(() => usePostsInProgressStore((state) => state));
    act(() => {
      result.current.actions.getPosts();
    });

    expect(spy).toBeCalled();
    expect(result.current.total).toBe(0);
    expect(result.current.data.length).toBe(0);
  });

  it('should get data success with data.length = 0 and store data.lenght > 0', () => {
    usePostsInProgressStore.setState((state: IPostsInProgressState) => {
      state.total = 1;
      state.data = [{ id: 0 }];
      return state;
    });

    const response = {
      data: [],
      total: 0,
    };
    const spy = jest.spyOn(streamApi, 'getDraftPosts').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => usePostsInProgressStore((state) => state));
    act(() => {
      result.current.actions.getPosts();
    });

    expect(result.current.total).toBe(1);
    expect(result.current.data.length).toBe(1);
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.total).toBe(1);
    expect(result.current.data.length).toBe(1);
  });

  it('should get data success with data.length > 0 and store value is init value', () => {
    const response = {
      data: [1, 2], total: 2,
    };
    const spy = jest.spyOn(streamApi, 'getDraftPosts').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => usePostsInProgressStore((state) => state));
    act(() => {
      result.current.actions.getPosts();
    });
    expect(result.current.total).toBe(0);
    expect(result.current.data.length).toBe(0);

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });
    expect(result.current.total).toBe(2);
    expect(result.current.data.length).toBe(2);
  });

  it('should get data success with data.length > 0 and store value data.length > 0', () => {
    usePostsInProgressStore.setState((state: IPostsInProgressState) => {
      state.total = 1;
      state.data = [{ id: 0 }];
      return state;
    });

    const response = {
      data: [{ id: 1 }, { id: 2 }], total: 2,
    };
    const spy = jest.spyOn(streamApi, 'getDraftPosts').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => usePostsInProgressStore((state) => state));
    act(() => {
      result.current.actions.getPosts();
    });
    expect(result.current.total).toBe(1);
    expect(result.current.data.length).toBe(1);

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });
    expect(result.current.total).toBe(1);
    expect(result.current.data.length).toBe(1);
  });

  it('should get data success with response.data.length > 0 and store value data.length > response.data.length', () => {
    usePostsInProgressStore.setState((state: IPostsInProgressState) => {
      state.total = 2;
      state.data = [{ id: 1 }, { id: 2 }];
      return state;
    });

    const response = {
      data: [{ id: 0 }], total: 1,
    };
    const spy = jest.spyOn(streamApi, 'getDraftPosts').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => usePostsInProgressStore((state) => state));
    act(() => {
      result.current.actions.getPosts();
    });
    expect(result.current.total).toBe(2);
    expect(result.current.data.length).toBe(2);

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });
    expect(result.current.total).toBe(2);
    expect(result.current.data.length).toBe(2);
  });

  it('should get series throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getDraftPosts').mockImplementation(
      () => Promise.reject(error) as any,
    );

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
    expect(result.current.total).toBe(0);
    expect(result.current.data.length).toBe(0);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
