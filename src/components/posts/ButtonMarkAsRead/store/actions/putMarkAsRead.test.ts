import streamApi from '~/api/StreamApi';
import { IPayloadPutMarkAsRead } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import useModalStore from '~/store/modal';
import { act, renderHook } from '~/test/testUtils';
import useButtonMarkAsReadStore, { IButtonMarkAsReadState } from '../index';
import { responsePutMarkAsRead } from '../__mocks__/data';

describe('putMarkAsRead', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const callback = jest.fn();

  it('should not Id', () => {
    const payload: IPayloadPutMarkAsRead = {
      postId: null,
      callback,
    };

    const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const { result } = renderHook(() => useButtonMarkAsReadStore((state: IButtonMarkAsReadState) => state));
    act(() => {
      result.current.actions.putMarkAsRead(payload);
    });

    expect(error).toBeCalled();
  });

  it('should put Mark As Read success:', () => {
    const payload: IPayloadPutMarkAsRead = {
      postId: '123',
      callback,
    };
    const response = responsePutMarkAsRead;

    const spy = jest.spyOn(streamApi, 'putMarkAsRead').mockImplementation(() => Promise.resolve(response) as any);

    const addToPosts = jest.fn();
    const actions = {
      addToPosts,
    };
    const spyPostStore = jest.spyOn(usePostsStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useButtonMarkAsReadStore((state: IButtonMarkAsReadState) => state));
    act(() => {
      result.current.actions.putMarkAsRead(payload);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(spyPostStore).toBeCalled();
  });

  it('should put Mark As Read throw error:', () => {
    const error = 'error';
    const payload: IPayloadPutMarkAsRead = {
      postId: '123',
      callback,
    };

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const spy = jest.spyOn(streamApi, 'putMarkAsRead').mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useButtonMarkAsReadStore((state: IButtonMarkAsReadState) => state));
    act(() => {
      try {
        result.current.actions.putMarkAsRead(payload);
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
