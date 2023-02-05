import useModalStore from '~/store/modal';
import { POST_DETAIL } from '~/test/mock_data/post';
import { act, renderHook } from '~/test/testUtils';
import usePostsStore, { IPostsState } from '../index';

describe('deletePostLocal', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should not Id', () => {
    const id = null;

    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));
    act(() => {
      result.current.actions.deletePostLocal(id);
    });

    expect(warn).toBeCalled();
  });

  it('should delete Post local success:', () => {
    const data = { [POST_DETAIL.id]: POST_DETAIL } as any;

    usePostsStore.getState().actions.setPosts(data);

    jest.useFakeTimers();
    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));
    act(() => {
      result.current.actions.deletePostLocal(POST_DETAIL.id);
    });
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.posts[POST_DETAIL.id].deleted).toBe(true);
  });

  it('should delete Post local throw error:', () => {
    const error = 'error';
    usePostsStore.setState((state) => {
      state.posts = null;
      return state;
    });

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));
    act(() => {
      try {
        result.current.actions.deletePostLocal(POST_DETAIL.id);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalled();
  });
});
