import { act, renderHook } from '~/test/testUtils';
import useUserProfileStore from '../index';
import { responseGetWorkExperience } from '../__mocks__/data';
import userApi from '~/api/UserApi';

describe('getWorkExperience', () => {
  const userId = 'test';

  it('should getWorkExperience success:', () => {
    const spy = jest
      .spyOn(userApi, 'getWorkExperience')
      .mockImplementation(() => Promise.resolve(responseGetWorkExperience) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useUserProfileStore((state) => state));
    act(() => {
      result.current.actions.getWorkExperience(userId);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.userWorkExperience).toEqual(responseGetWorkExperience.data);
  });

  it('should getWorkExperience throw error', () => {
    const error = 'internal error';

    const spy = jest.spyOn(userApi, 'getWorkExperience').mockImplementation(() => Promise.reject(error) as any);

    const errorLog = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    jest.useFakeTimers();
    const { result } = renderHook(() => useUserProfileStore((state) => state));
    act(() => {
      try {
        result.current.actions.getWorkExperience(userId);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(errorLog).toBeCalled();
  });
});
