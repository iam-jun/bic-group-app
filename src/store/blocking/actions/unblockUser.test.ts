import groupApi from '~/api/GroupApi';
import { responseUnblockUser } from '~/test/mock_data/blocking';
import { act, renderHook } from '~/test/testUtils';
import useBlockingStore from '../index';
import * as showToastError from '~/store/helper/showToastError';
import * as showToastSuccess from '~/store/helper/showToastSuccess';

describe('unblockUser', () => {
  const userId = 'test';

  it('should unblockUser success:', () => {
    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');
    const spy = jest
      .spyOn(groupApi, 'unblockUser')
      .mockImplementation(() => Promise.resolve(responseUnblockUser) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useBlockingStore((state) => state));
    act(() => {
      result.current.actions.unblockUser(userId);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should unblockUser throw error', () => {
    const spyShowToastError = jest.spyOn(showToastError, 'default');
    const error = 'internal error';
    const spy = jest.spyOn(groupApi, 'unblockUser').mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useBlockingStore((state) => state));
    act(() => {
      try {
        result.current.actions.unblockUser(userId);
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
