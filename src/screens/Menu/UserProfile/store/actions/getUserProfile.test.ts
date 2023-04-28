import groupApi from '~/api/GroupApi';
import { IGetUserProfile } from '~/interfaces/IAuth';
import { mapProfile } from '~/helpers/common';
import { act, renderHook } from '~/test/testUtils';
import useUserProfileStore from '../index';
import { responseGetUserProfile } from '../__mocks__/data';

describe('getUserProfile', () => {
  const payload: IGetUserProfile = {
    params: undefined,
    silentLoading: undefined,
    userId: '97f3a300-97ee-4d9d-bc3e-3a8724d9d511',
  };

  it('should getUserProfile success:', () => {
    const spy = jest
      .spyOn(groupApi, 'getUserProfile')
      .mockImplementation(() => Promise.resolve(responseGetUserProfile) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useUserProfileStore((state) => state));
    act(() => {
      result.current.actions.getUserProfile({ userId: payload.userId, params: payload.params });
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toEqual(false);
    expect(result.current.data).toEqual(mapProfile(responseGetUserProfile.data));
  });

  it('should getUserProfile throw error', () => {
    const error = 'internal error';

    const spy = jest.spyOn(groupApi, 'getUserProfile').mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useUserProfileStore((state) => state));
    act(() => {
      try {
        result.current.actions.getUserProfile({ userId: payload.userId, params: payload.params });
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toEqual(false);
    expect(result.current.error).toEqual(error);
  });
});
