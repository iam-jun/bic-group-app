import { USER_PROFILE } from '../../../test/mock_data/menu';
import groupApi from '~/api/GroupApi';
import { renderHook, act } from '~/test/testUtils';
import useCommonController from '../index';
import useModalStore from '~/store/modal';

describe('getMyProfile', () => {
  const userId = 'userId';

  it('should call API success', () => {
    const response = {
      data: USER_PROFILE,
    };

    const spy = jest.spyOn(groupApi, 'getUserProfile').mockImplementation(
      () => Promise.resolve(response),
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      result.current.actions.getMyProfile({ userId });
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.myProfile).toEqual(response.data);
  });

  it('should call API fail and throws error', () => {
    const error = {
      meta: {
        message: 'Error message',
      },
    };
    const spy = jest.spyOn(groupApi, 'getUserProfile').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      try {
        result.current.actions.getMyProfile({ userId });
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
      content: error.meta.message,
      type: 'error',
    });
  });
});
