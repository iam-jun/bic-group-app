import { responseBlockUser } from '~/test/mock_data/blocking';
import { act, renderHook } from '~/test/testUtils';
import useBlockingStore from '../index';
import * as showToastError from '~/store/helper/showToastError';
import * as showToastSuccess from '~/store/helper/showToastSuccess';
import userApi from '~/api/UserApi';

describe('blockUser', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const blockedUserId = 'test';

  it('should blockUser success:', () => {
    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');
    const callback = jest.fn();
    const spy = jest.spyOn(userApi, 'blockUser').mockImplementation(() => Promise.resolve(responseBlockUser) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useBlockingStore((state) => state));
    act(() => {
      result.current.actions.blockUser(blockedUserId, callback);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should blockUser throw error', () => {
    const spyShowToastError = jest.spyOn(showToastError, 'default');
    const error = 'internal error';
    const spy = jest.spyOn(userApi, 'blockUser').mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useBlockingStore((state) => state));
    act(() => {
      try {
        result.current.actions.blockUser(blockedUserId);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastError).toBeCalled();
  });
});
