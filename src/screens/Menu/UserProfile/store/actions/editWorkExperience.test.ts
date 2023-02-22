import groupApi from '~/api/GroupApi';
import useModalStore from '~/store/modal';
import { act, renderHook } from '~/test/testUtils';
import useUserProfileStore from '../index';
import { responseEditWorkExperience } from '../__mocks__/data';

describe('editWorkExperience', () => {
  const id = 'test';
  const params = {
    company: 'test',
    titlePosition: 'test',
    location: 'test',
    description: 'test',
    currentlyWorkHere: true,
    startDate: '2022-02-09T17:00:00.000Z',
    endDate: null,
  };

  it('should editWorkExperience success:', () => {
    const spy = jest
      .spyOn(groupApi, 'editWorkExperience')
      .mockImplementation(() => Promise.resolve(responseEditWorkExperience) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useUserProfileStore((state) => state));
    act(() => {
      result.current.actions.editWorkExperience(id, params);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should editWorkExperience throw error', () => {
    const error = 'internal error';

    const spy = jest.spyOn(groupApi, 'editWorkExperience').mockImplementation(() => Promise.reject(error) as any);

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useUserProfileStore((state) => state));
    act(() => {
      try {
        result.current.actions.editWorkExperience(id, params);
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
