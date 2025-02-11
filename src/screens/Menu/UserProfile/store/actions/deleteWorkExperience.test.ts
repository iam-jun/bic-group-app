import { mapWorkExperience } from '~/screens/Menu/store/helpler';
import useModalStore from '~/store/modal';
import { mapProfile } from '~/helpers/common';
import { act, renderHook } from '~/test/testUtils';
import useUserProfileStore from '../index';
import { responseDeleteWorkExperience, responseGetUserProfile } from '../__mocks__/data';
import userApi from '~/api/UserApi';

describe('deleteWorkExperience', () => {
  const id = 'test';

  it('should deleteWorkExperience success:', () => {
    const spy = jest
      .spyOn(userApi, 'deleteWorkExperience')
      .mockImplementation(() => Promise.resolve(responseDeleteWorkExperience) as any);

    const spyApiGetUserProfile = jest
      .spyOn(userApi, 'getUserProfile')
      .mockImplementation(() => Promise.resolve(responseGetUserProfile) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useUserProfileStore((state) => state));
    act(() => {
      result.current.actions.deleteWorkExperience(id);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.userWorkExperience).toEqual(mapWorkExperience(responseDeleteWorkExperience.data));
    expect(spyApiGetUserProfile).toBeCalled();
    expect(result.current.loading).toEqual(false);
    expect(result.current.data).toEqual(mapProfile(responseGetUserProfile.data));
  });

  it('should deleteWorkExperience throw error', () => {
    const error = 'internal error';

    const spy = jest.spyOn(userApi, 'deleteWorkExperience').mockImplementation(() => Promise.reject(error) as any);

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useUserProfileStore((state) => state));
    act(() => {
      try {
        result.current.actions.deleteWorkExperience(id);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalled();
  });
});
