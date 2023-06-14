import streamApi from '~/api/StreamApi';
import { PostType } from '~/interfaces/IPost';
import { renderHook, act } from '~/test/testUtils';
import useCommonController from '../index';
import * as showToastError from '~/store/helper/showToastError';
import * as showToastSuccess from '~/store/helper/showToastSuccess';

describe('unsave post', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');
  const spyShowToastError = jest.spyOn(showToastError, 'default');

  it('should call API success to save POST', () => {
    const spy = jest.spyOn(streamApi, 'postUnsaveContent').mockImplementation(
      () => Promise.resolve({}),
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      result.current.actions.unsavePost('123', PostType.POST);
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should call API success to save ARTICLE', () => {
    const spy = jest.spyOn(streamApi, 'postUnsaveContent').mockImplementation(
      () => Promise.resolve({}),
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      result.current.actions.unsavePost('123', PostType.ARTICLE);
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should call API success to save SERIES', () => {
    const spy = jest.spyOn(streamApi, 'postUnsaveContent').mockImplementation(
      () => Promise.resolve({}),
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      result.current.actions.unsavePost('123', PostType.SERIES);
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should call API and throws an error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'postUnsaveContent').mockImplementation(
      () => Promise.reject(error) as any,
    );

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

    expect(spyShowToastError).toBeCalled();
  });
});
