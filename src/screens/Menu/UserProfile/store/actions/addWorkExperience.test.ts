import useModalStore from '~/store/modal';
import { act, renderHook } from '~/test/testUtils';
import useUserProfileStore from '../index';
import { responseAddWorkExperience } from '../__mocks__/data';
import userApi from '~/api/UserApi';

describe('addWorkExperience', () => {
  const params = {
    company: 'test',
    titlePosition: 'test',
    location: 'test',
    description: 'test',
    currentlyWorkHere: true,
    startDate: '2022-02-09T17:00:00.000Z',
    endDate: null,
  };

  it('should addWorkExperience success:', () => {
    const spy = jest
      .spyOn(userApi, 'addWorkExperience')
      .mockImplementation(() => Promise.resolve(responseAddWorkExperience) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useUserProfileStore((state) => state));
    act(() => {
      result.current.actions.addWorkExperience(params);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should addWorkExperience throw error', () => {
    const error = 'internal error';

    const spy = jest.spyOn(userApi, 'addWorkExperience').mockImplementation(() => Promise.reject(error) as any);

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useUserProfileStore((state) => state));
    act(() => {
      try {
        result.current.actions.addWorkExperience(params);
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
