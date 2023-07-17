import { act, renderHook } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import { getSettingsResponse } from '~/test/mock_data/group';
import useMembershipPolicySettingsStore from '../index';
import * as showToastError from '~/store/helper/showToastError';

describe('getSettings', () => {
  const groupId = 'test';

  it('should getSettings success', () => {
    const spyCallApi = jest
      .spyOn(groupApi, 'getSettings')
      .mockImplementation(() => Promise.resolve(getSettingsResponse) as any);

    jest.useFakeTimers();

    const { result } = renderHook(() => useMembershipPolicySettingsStore((state) => state));
    act(() => {
      result.current.actions.getSettings(groupId);
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(spyCallApi).toBeCalled();
    expect(result.current.data).toEqual(getSettingsResponse.data);
  });

  it('should getSettings throw error:', () => {
    const error = 'error';
    const spyShowToastError = jest.spyOn(showToastError, 'default');
    const spy = jest.spyOn(groupApi, 'getSettings').mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useMembershipPolicySettingsStore((state) => state));
    act(() => {
      try {
        result.current.actions.getSettings(groupId);
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
