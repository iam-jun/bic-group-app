import streamApi from '~/api/StreamApi';
import { PostType } from '~/interfaces/IPost';
import useModalStore from '~/store/modal';
import { renderHook, act } from '~/test/testUtils';
import useCommonController from '../index';

describe('unsave post', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should call API success to save POST', () => {
    const spy = jest.spyOn(streamApi, 'postUnsaveContent').mockImplementation(
      () => Promise.resolve({}),
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      result.current.actions.unsavePost('123', PostType.POST);
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalledWith({
      content: 'post:text_unsaved',
    });
  });

  it('should call API success to save ARTICLE', () => {
    const spy = jest.spyOn(streamApi, 'postUnsaveContent').mockImplementation(
      () => Promise.resolve({}),
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      result.current.actions.unsavePost('123', PostType.ARTICLE);
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalledWith({
      content: 'article:text_unsaved',
    });
  });

  it('should call API success to save SERIES', () => {
    const spy = jest.spyOn(streamApi, 'postUnsaveContent').mockImplementation(
      () => Promise.resolve({}),
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      result.current.actions.unsavePost('123', PostType.SERIES);
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalledWith({
      content: 'series:text_unsaved',
    });
  });

  it('should call API and throws an error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'postUnsaveContent').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      try {
        result.current.actions.unsavePost('123', PostType.POST);
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
      content: 'common:text_unsave_fail',
    });
  });
});
