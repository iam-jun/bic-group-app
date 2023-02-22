import groupApi from '~/api/GroupApi';
import { act, renderHook } from '~/test/testUtils';
import useUserProfileStore from '../index';
import { responseGetLanguages } from '../__mocks__/data';

describe('getLanguages', () => {
  it('should getLanguages success:', () => {
    const spy = jest.spyOn(groupApi, 'getLanguages').mockImplementation(() => Promise.resolve(responseGetLanguages) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useUserProfileStore((state) => state));
    act(() => {
      result.current.actions.getLanguages();
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.languages).toEqual(responseGetLanguages.data);
  });

  it('should getLanguages throw error', () => {
    const error = 'internal error';

    const spy = jest.spyOn(groupApi, 'getLanguages').mockImplementation(() => Promise.reject(error) as any);

    const errorLog = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    jest.useFakeTimers();
    const { result } = renderHook(() => useUserProfileStore((state) => state));
    act(() => {
      try {
        result.current.actions.getLanguages();
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
