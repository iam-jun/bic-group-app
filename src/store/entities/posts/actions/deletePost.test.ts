import streamApi from '~/api/StreamApi';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import { IPayloadDeletePost } from '~/interfaces/IPost';
import useModalStore from '~/store/modal';
import { act, renderHook } from '~/test/testUtils';
import usePostsStore, { IPostsState } from '../index';

describe('deletePost', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should not Id', () => {
    const payload: IPayloadDeletePost = {
      id: null,
      callbackError: jest.fn(),
    };

    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));
    act(() => {
      result.current.actions.deletePost(payload);
    });

    expect(warn).toBeCalled();
  });

  it('should delete Post success:', () => {
    const payload: IPayloadDeletePost = {
      id: '123',
      callbackError: jest.fn(),
    };
    const response = { code: 'api.ok', data: true, meta: { message: 'OK' } };

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const spy = jest.spyOn(streamApi, 'deletePost').mockImplementation(() => Promise.resolve(response) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));
    act(() => {
      result.current.actions.deletePost(payload);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalledWith({
      content: response.meta.message,
      type: ToastType.SUCCESS,
    });
  });

  it('should delete Post throw error:', () => {
    const error = 'error';
    const payload: IPayloadDeletePost = {
      id: '123',
      callbackError: jest.fn(),
    };

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const spy = jest.spyOn(streamApi, 'deletePost').mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));
    act(() => {
      try {
        result.current.actions.deletePost(payload);
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
