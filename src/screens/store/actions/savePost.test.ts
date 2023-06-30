import streamApi from '~/api/StreamApi';
import { renderHook, act } from '~/test/testUtils';
import useCommonController from '../index';
import { PostType } from '~/interfaces/IPost';
import * as showToastError from '~/store/helper/showToastError';
import * as showToastSuccess from '~/store/helper/showToastSuccess';

describe('savePost', () => {
  it('should call API success', () => {
    const spy = jest.spyOn(streamApi, 'postSaveContent').mockImplementation(
      () => Promise.resolve({}),
    );

    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      result.current.actions.savePost('123', PostType.POST);
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should call API and throws an error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'postSaveContent').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const spyShowToastError = jest.spyOn(showToastError, 'default');

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

    expect(spyShowToastError).toBeCalled();
  });
});
