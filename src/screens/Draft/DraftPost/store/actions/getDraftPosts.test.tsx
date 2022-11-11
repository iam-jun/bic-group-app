import streamApi from '~/api/StreamApi';
import { POST_DETAIL } from '~/test/mock_data/post';
import { act, renderHook } from '~/test/testUtils';
import useDraftPostStore from '../index';
import IDraftPostState from '../Interface';

describe('getDraftPosts', () => {
  it('should call api get draft posts when isRefresh = true throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getDraftPosts').mockImplementation(
      () => Promise.reject(error) as any,
    );

    useDraftPostStore.setState((state:IDraftPostState) => {
      state.posts = [{ a: 1 }] as any;
      return state;
    });
    jest.useFakeTimers();
    const { result } = renderHook(() => useDraftPostStore((state) => state));
    act(() => {
      try {
        result.current.actions.getDraftPosts({ isRefresh: true });
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
    expect(result.current.refreshing).toBe(false);
    expect(result.current.loading).toBe(false);
  });
  it('should call api get draft posts when isRefresh = true success', () => {
    const response = {
      data: [POST_DETAIL],
      canLoadMore: true,
    };
    const spy = jest.spyOn(streamApi, 'getDraftPosts').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    useDraftPostStore.setState((state:IDraftPostState) => {
      state.posts = [{ a: 1 }] as any;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useDraftPostStore((state) => state));
    act(() => {
      result.current.actions.getDraftPosts({ isRefresh: true });
    });
    expect(result.current.refreshing).toBe(true);
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
    expect(result.current.posts).toEqual(response.data);
    expect(result.current.loading).toBe(false);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.refreshing).toBe(false);
  });
});
