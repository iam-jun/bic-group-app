import streamApi from '~/api/StreamApi';
import { IPayloadPutMarkSeenPost } from '~/interfaces/IPost';
import useModalStore from '~/store/modal';
import { act, renderHook } from '~/test/testUtils';
import usePostsStore, { IPostsState } from '../index';
import { responsePutMarkSeenPost } from '../__mocks__/data';

describe('putMarkSeenPost', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should not Id', () => {
    const payload: IPayloadPutMarkSeenPost = {
      postId: null,
    };
    const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));
    act(() => {
      result.current.actions.putMarkSeenPost(payload);
    });
    expect(error).toBeCalled();
  });

  it('should put Mark Seen Post success:', () => {
    const payload: IPayloadPutMarkSeenPost = {
      postId: '123',
    };
    const response = responsePutMarkSeenPost;

    const spy = jest.spyOn(streamApi, 'putMarkAsRead').mockImplementation(() => Promise.resolve(response) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));
    act(() => {
      result.current.actions.putMarkSeenPost(payload);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should put Mark Seen Post throw error:', () => {
    const error = 'error';
    const payload: IPayloadPutMarkSeenPost = {
      postId: '123',
    };

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const spy = jest.spyOn(streamApi, 'putEditPost').mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));
    act(() => {
      try {
        result.current.actions.putMarkSeenPost(payload);
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
});
