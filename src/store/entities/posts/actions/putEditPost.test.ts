/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import i18n from 'i18next';
import streamApi from '~/api/StreamApi';
import { IPayloadPutEditPost } from '~/interfaces/IPost';
import useModalStore from '~/store/modal';
import { act, renderHook } from '~/test/testUtils';
import usePostsStore, { IPostsState } from '../index';
import { postCreatePost, responsePutEditPost } from '../__mocks__/data';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

describe('putEditPost', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const onRetry = jest.fn();
  const payload: IPayloadPutEditPost = {
    id: responsePutEditPost.data.id,
    data: postCreatePost as any,
    replaceWithDetail: true,
    onRetry,
    msgSuccess: 'post:text_edit_post_success',
    msgError: 'post:text_edit_post_failed',
    disableNavigate: false,
  };

  it('should not Id', () => {
    const payload: IPayloadPutEditPost = {
      id: null,
      data: null,
    };

    const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));
    act(() => {
      result.current.actions.putEditPost(payload);
    });

    expect(error).toBeCalled();
  });

  // it('should put edit Post success:', () => {
  //   const response = responsePutEditPost;

  //   const showToast = jest.fn();
  //   const actions = { showToast };
  //   jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

  //   const spy = jest.spyOn(streamApi, 'putEditPost').mockImplementation(() => Promise.resolve(response) as any);

  //   jest.useFakeTimers();
  //   const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));
  //   act(() => {
  //     result.current.actions.putEditPost(payload);
  //   });
  //   expect(spy).toBeCalled();
  //   act(() => {
  //     jest.runAllTimers();
  //   });

  //   expect(showToast).toBeCalledWith({
  //     content: i18n.t(payload.msgSuccess),
  //     type: ToastType.SUCCESS,
  //   });
  // });

  // it('should put edit Post throw error:', () => {
  //   const error = 'error';

  //   const showToast = jest.fn();
  //   const actions = { showToast };
  //   jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

  //   const spy = jest.spyOn(streamApi, 'putEditPost').mockImplementation(() => Promise.reject(error) as any);

  //   jest.useFakeTimers();
  //   const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));
  //   act(() => {
  //     try {
  //       result.current.actions.putEditPost(payload);
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(TypeError);
  //       expect(e).toBe(error);
  //     }
  //   });
  //   expect(spy).toBeCalled();
  //   act(() => {
  //     jest.runAllTimers();
  //   });

  //   expect(showToast).toBeCalled();
  // });
});
