import { responseGetListBlockingUsers } from '~/test/mock_data/blocking';
import { act, renderHook } from '~/test/testUtils';
import useBlockingStore from '../index';
import * as showToastError from '~/store/helper/showToastError';
import userApi from '~/api/UserApi';

describe('getListBlockingUsers', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should getListBlockingUsers success:', () => {
    const spy = jest
      .spyOn(userApi, 'getListBlockingUsers')
      .mockImplementation(() => Promise.resolve(responseGetListBlockingUsers) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useBlockingStore((state) => state));
    act(() => {
      result.current.actions.getListBlockingUsers();
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.list).toEqual(responseGetListBlockingUsers.data);
  });

  it('should getListBlockingUsers throw error', () => {
    const spyShowToastError = jest.spyOn(showToastError, 'default');
    const error = 'internal error';
    const spy = jest.spyOn(userApi, 'getListBlockingUsers').mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useBlockingStore((state) => state));
    act(() => {
      try {
        result.current.actions.getListBlockingUsers();
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
