import streamApi from '~/api/StreamApi';
import useModalStore from '~/store/modal';
import { renderHook, act } from '~/test/testUtils';
import useCommonController from '../index';
import { PostType } from '~/interfaces/IPost';

describe('savePost', () => {
  it('should call API success', () => {
    const spy = jest.spyOn(streamApi, 'postSaveContent').mockImplementation(
      () => Promise.resolve({}),
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      result.current.actions.savePost('123', PostType.POST);
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalledWith({
      content: 'post:text_saved',
    });
  });

  it('should call API and throws an error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'postSaveContent').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      try {
        result.current.actions.savePost('123', PostType.POST);
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalledWith({
      content: 'common:text_save_fail',
    });
  });
});
